use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tokio::fs;

const APP_NAME: &str = "anki-creator";
const CONFIG_FILE_NAME: &str = "config.toml";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub api_key: Option<String>,
    // Add other configuration fields here
    // Example:
    // pub theme: String,
    // pub default_deck: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            api_key: None,
            // Initialize default values for other fields
            // theme: "light".to_string(),
            // default_deck: "Default".to_string(),
        }
    }
}

fn get_config_path() -> Result<PathBuf> {
    let config_dir = dirs::config_dir()
        .context("Failed to get config directory")?
        .join(APP_NAME);
    Ok(config_dir.join(CONFIG_FILE_NAME))
}

pub async fn load_config() -> Result<Config> {
    let config_path = get_config_path()?;
    let config_dir = config_path.parent().context("Invalid config path")?;

    if !fs::try_exists(&config_dir).await? {
        fs::create_dir_all(&config_dir)
            .await
            .context("Failed to create config directory")?;
    }

    if !fs::try_exists(&config_path).await? {
        // Config file doesn't exist, create with defaults
        let default_config = Config::default();
        save_config(&default_config).await?;
        Ok(default_config)
    } else {
        // Config file exists, load it
        let config_content = fs::read_to_string(&config_path)
            .await
            .context("Failed to read config file")?;
        let config: Config =
            toml::from_str(&config_content).context("Failed to parse config file (TOML)")?;
        Ok(config)
    }
}

pub async fn save_config(config: &Config) -> Result<()> {
    let config_path = get_config_path()?;
    let config_content =
        toml::to_string_pretty(config).context("Failed to serialize config to TOML")?;
    fs::write(&config_path, config_content)
        .await
        .context("Failed to write config file")?;
    Ok(())
}

// Optional: Function to get the config directory path for other uses (e.g., storage)
pub fn get_app_config_dir() -> Result<PathBuf> {
    dirs::config_dir()
        .context("Failed to get config directory")?
        .join(APP_NAME)
        .canonicalize() // Ensure path exists and is absolute
        .context("Failed to canonicalize config dir path")
}

// Optional: Function to get the local data directory path
pub fn get_app_data_dir() -> Result<PathBuf> {
    dirs::data_local_dir()
        .context("Failed to get local data directory")?
        .join(APP_NAME)
        .canonicalize() // Ensure path exists and is absolute
        .context("Failed to canonicalize data dir path")
}
