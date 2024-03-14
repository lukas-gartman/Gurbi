import React, { useState } from 'react';
import axios from 'axios';
import '../stylesheets/NewEvent.css'
import '../stylesheets/Form.css';
import { useNavigate, useLoaderData, redirect } from 'react-router-dom';
import Header from '../components/Header';
import { ClientContext } from '../App';
import { useContext } from 'react';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';

function NewEvent() {
    const client = useContext(ClientContext);
    const orgId = useLoaderData() as number;

    let nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };
    
    const header = (
        <>
        <div className="header-row">
            <i id="back-button" onClick={goBack} className="bi bi-arrow-left-short" />
        </div>
        </>
    );
    
    interface NewEventFormData {
        title: string;
        date: Date;
        location: string;
        description: string;
    };

    const [formData, setFormData] = useState<NewEventFormData>({title: "", date: new Date(), location: "", description: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const toastConfig: ToastOptions = { position: "bottom-left", autoClose: 3000, theme: "colored" };
        try {
            client.post(`/event/authorized/organisation/${orgId}`, formData).then(r => {
                if (r.status == 200) {
                    nav(`/events/${r.data.eventId}`);
                }
            }).catch(err => {
                toast.error(err.response.data.msg, toastConfig);
                console.error(err.response.data.msg)
            });
        } catch (error: any) {
            console.error(error.response.data);
        }
    };

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="new-event form-container">
                <ToastContainer />
                <h1>New event</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input name="title" type="text" onChange={handleChange} placeholder="Event title" required />
                    <input name="date" type="date" onChange={handleChange} required />
                    <input name="location" type="text" onChange={handleChange} placeholder="Location" />
                    <textarea name="description" rows={4} onChange={handleChange} placeholder="Description" />
                    <input type="submit" value="Publish event" />
                </form>
            </main>
        </div>
    );
}

export default NewEvent;

