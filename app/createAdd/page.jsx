'use client';

import Header from '../components/header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAddPage() {
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitMessageType, setSubmitMessageType] = useState(''); // 'success' ou 'error'


    const [form, setForm] = useState({
        hero: '',
        itemLevel: '',
        localisation: '',
        rating: '',
        keyResearched: '',
        highestKey: '',
        invitationLink: ''
    });
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // si déjà en train d'envoyer, bloquer
        setIsSubmitting(true);

        const highestKeyNum = Number(form.highestKey);
        const keyResearchedNum = Number(form.keyResearched);
        let tempErrors = {};

        if (isNaN(highestKeyNum) || isNaN(keyResearchedNum)) {
            tempErrors.highestKey = 'Highest key and key researched must be numbers';
        } else if (keyResearchedNum > highestKeyNum) {
            tempErrors.keyResearched = 'Key researched cannot be higher than your highest timed dungeon';
        }
        const linkRegex = /^FELLOWSHIP-[A-Z0-9]{26}$/;
        if (!linkRegex.test(form.invitationLink)) {
            tempErrors.invitationLink = 'Unvalid invitation link';
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            setIsSubmitting(false)
            return;
        }

        const res = await fetch('/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hero: form.hero,
                highestKey: form.highestKey,
                keyResearched: form.keyResearched,
                localisation: form.localisation,
                score: form.rating,
                lienInvitation: form.invitationLink,
                itemLevel: form.itemLevel,
                rating: form.rating,
                invitationLink: form.invitationLink
            })


        });

        if (res.ok) {
            setSubmitMessage('Created !');
            setSubmitMessageType('success');

            setForm({
                hero: '',
                itemLevel: '',
                localisation: '',
                rating: '',
                keyResearched: '',
                highestKey: '',
                invitationLink: ''
            });
            setTimeout(() => {
                setSubmitMessage('');
                router.push('/'); // redirection après 3 secondes
            }, 1000);
        } else {
            setSubmitMessage('Error, the announce could not be created.');
            setSubmitMessageType('error');
            setTimeout(() => setSubmitMessage(''), 3000);
            setIsSubmitting(false)

        }
    };
    return (
        <div className="p-6 max-w-lg mx-auto">
            <Header />
            <h1 className="text-2xl font-bold mb-6 text-center mt-40">Créer une nouvelle annonce</h1>
            {submitMessage && (
                <div className={`mb-4 p-3 rounded shadow-md text-center text-white 
        ${submitMessageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {submitMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">

                <div>
                    <label htmlFor="hero" className="block font-semibold mb-1">Hero</label>
                    <select
                        name="hero"
                        id="hero"
                        value={form.hero}
                        maxLength={7}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select a hero</option>
                        <option value="ardeos">Ardeos</option>
                        <option value="elarion">Elarion</option>
                        <option value="helena">Helena</option>
                        <option value="mara">Mara</option>
                        <option value="meiko">Meiko</option>
                        <option value="rime">Rime</option>
                        <option value="sylvie">Sylvie</option>
                        <option value="tariq">Tariq</option>
                        <option value="vigour">Vigour</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="itemLevel" className="block font-semibold mb-1">Item level</label>
                    <input
                        id="itemLevel"
                        name="itemLevel"
                        type="number"
                        maxLength={3}
                        min={0}
                        max={330}
                        value={form.itemLevel}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label htmlFor="localisation" className="block font-semibold mb-1">Localisation</label>
                    <select
                        name="localisation"
                        id="localisation"
                        minLength={2}
                        maxLength={4}
                        value={form.localisation}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select a region</option>
                        <option value="NA">North America</option>
                        <option value="EU">Europe</option>
                        <option value="ASIA">Asia</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="rating" className="block font-semibold mb-1">Rating</label>
                    <input
                        id="rating"
                        name="rating"
                        type="number"
                        maxLength={5}
                        min={0}
                        max={20000}
                        value={form.rating}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label htmlFor="keyResearched" className="block font-semibold mb-1">The dungeon level you want</label>
                    <input
                        id="keyResearched"
                        name="keyResearched"
                        type="number"
                        maxLength={2}
                        min={1}
                        max={99}
                        value={form.keyResearched}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.keyResearched && (
                        <p className="text-red-500 text-sm mt-1">{errors.keyResearched}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="highestKey" className="block font-semibold mb-1">Your highest key timed</label>
                    <input
                        id="highestKey"
                        name="highestKey"
                        type="number"
                        maxLength={2}
                        min={1}
                        max={99}
                        value={form.highestKey}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.highestKey && (
                        <p className="text-red-500 text-sm mt-1">{errors.highestKey}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="invitationLink" className="block font-semibold mb-1">Your invitation link</label>
                    <input
                        id="invitationLink"
                        name="invitationLink"
                        type="text"
                        maxLength={37}
                        value={form.invitationLink}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.invitationLink && (
                        <p className="text-red-500 text-sm mt-1">{errors.invitationLink}</p>
                    )}
                </div>

                {errors.submit && (
                    <p className="text-red-500 text-sm mt-2">{errors.submit}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-2 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    );

}
