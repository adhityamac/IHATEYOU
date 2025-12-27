// Script to update Echo bot avatar in Firestore
// Run this in browser console or as a Node script

import { db } from './src/lib/firebase/config';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

async function updateEchoBotAvatar() {
    try {
        // Find all conversations with Echo bot
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, where('participants', 'array-contains', 'echo-bot-official'));

        const snapshot = await getDocs(q);

        console.log(`Found ${snapshot.size} Echo bot conversations`);

        // Update each conversation
        for (const doc of snapshot.docs) {
            const data = doc.data();

            // Update participant details
            if (data.participantDetails && data.participantDetails['echo-bot-official']) {
                await updateDoc(doc.ref, {
                    'participantDetails.echo-bot-official': {
                        name: 'Echo 🍊',
                        avatar: '/echo-tangerine.jpg',
                        ghostName: 'Echo 🍊'
                    }
                });
                console.log(`Updated conversation: ${doc.id}`);
            }
        }

        console.log('✅ All Echo bot avatars updated!');
    } catch (error) {
        console.error('Error updating Echo bot:', error);
    }
}

// Run the update
updateEchoBotAvatar();
