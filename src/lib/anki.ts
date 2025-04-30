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
 * @param type - The type of the card, default is 'Basic (type in the answer)'
 */
export async function createCard(deckName: string, frontTemplate: string, backTemplate: string, type: string = 'Basic (type in the answer)') {
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
            modelName: type
        }
    })
}

/**
 * Create a card with AI explanation
 * @param deckName - The name of the deck to create the card in
 * @param word - The word being defined
 * @param definition - The dictionary definition
 * @param aiExplanation - The AI-generated explanation
 * @param type - The type of card, default is 'Basic (type in the answer)'
 */
export async function createCardWithAI(
    deckName: string,
    word: string,
    definition: string,
    aiExplanation: string,
    type: string = 'Basic (type in the answer)'
) {
    const decks = await client.deck.deckNames()
    if (!decks.includes(deckName)) {
        await createDeck(deckName)
    }

    // Front template with both dictionary definition and AI explanation
    const frontTemplate = `
    <div class="card-content">
        <div class="dictionary-definition">
            <h3>Dictionary Definition</h3>
            ${definition}
        </div>
        <div class="ai-explanation">
            <h3>AI Explanation</h3>
            ${aiExplanation}
        </div>
    </div>
    `

    // Back template with the word
    const backTemplate = `<div><h1>${word}</h1></div>`

    return await client.note.addNote({
        note: {
            fields: {
                front: frontTemplate,
                back: backTemplate
            },
            deckName: deckName,
            modelName: type
        }
    })
}