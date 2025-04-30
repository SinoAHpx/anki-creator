import { YankiConnect } from 'yanki-connect'

const client = new YankiConnect()

/**
 * Create deck
 * @param name - The name of the deck to create
 */
export async function createDeck(name: string) {
    return await client.deck.createDeck({
        deck: name
    })
}

/**
 * Create card into specific deck
 * @param deckName - The name of the deck to create the card in, if not exist, it will be created
 * @param frontTemplate - The front template of the card
 * @param backTemplate - The back template of the card
 */
export async function createCard(deckName: string, frontTemplate: string, backTemplate: string) {
    const decks = await client.deck.deckNames()
    if (!decks.includes(deckName)) {
        await createDeck(deckName)
    }
    return await client.note.addNote({
        note: {
            fields: {
                front: frontTemplate,
                back: backTemplate
            },
            deckName: deckName,
            modelName: 'Basic'
        }
    })
}