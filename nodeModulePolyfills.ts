// Mock for node:util
export const promisify = (_fn: any) => {
	return (..._args: any) => Promise.resolve(null);
};

// Empty exports for other node modules
export const execFile = () => null;
export const process = { platform: "browser" };
