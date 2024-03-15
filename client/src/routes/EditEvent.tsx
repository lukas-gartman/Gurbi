import React, { useState } from 'react';
import '../stylesheets/Events.css'
import '../stylesheets/Form.css';
import { useNavigate, useLoaderData } from 'react-router-dom';
import Header from '../components/Header';
import { ClientContext } from '../App';
import { useContext } from 'react';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import { IEvent, Permission } from '../models/models';

function EditEvent() {
    interface EventData {
        event: IEvent;
        permissions: Permission[];
    }

    const data = useLoaderData() as EventData;
    const client = useContext(ClientContext);

    const toastConfig: ToastOptions = { position: "bottom-left", autoClose: 3000, theme: "colored" };

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
    
    interface EditEventFormData {
        title: string;
        date: Date;
        location: string;
        description: string;
    };

    const [formData, setFormData] = useState<EditEventFormData>({title: data.event.name, date: data.event.dateTime, location: data.event.location, description: data.event.description});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            client.put(`/event/authorized/organisation/${data.event.host.id}`, { eventId: data.event.id, formData: formData }).then(r => {
                if (r.status === 200) {
                    toast.success(r.data.messages[0], toastConfig);
                    nav(`/events/${data.event.id}`);
                }
            }).catch(err => {
                const messages = err.response.data.messages.join("\n");
                toast.error(messages, toastConfig);
                console.error(err.response.data.msg)
            });
        } catch (error: any) {
            console.error(error.response.data);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const response = await client.delete(`/event/${data.event.id}/authorized/organisation/${data.event.host.id}`);
                toast.success(response.data);
                nav("/events");
            } catch (e: any) {
                toast.error(e.response.data, toastConfig);
            }
        }
    }

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="new-event form-container">
                <ToastContainer />
                <h1>Edit event</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input name="title" type="text" onChange={handleChange} defaultValue={data.event.name} placeholder="Event title" required />
                    <input name="date" type="datetime-local" onChange={handleChange} defaultValue={ (new Date(data.event.dateTime.getTime() - (new Date()).getTimezoneOffset()*60000)).toISOString().slice(0,16)} required />
                    <input name="location" type="text" onChange={handleChange} defaultValue={data.event.location} placeholder="Location" />
                    <textarea name="description" rows={4} onChange={handleChange} defaultValue={data.event.description} placeholder="Description" />
                    <input type="submit" value="Update event" />
                </form>

                <span onClick={handleDelete} className="delete-btn">Delete event</span>
            </main>
        </div>
    );
}

export default EditEvent;

