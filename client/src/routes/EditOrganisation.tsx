import React, { useState } from 'react';
import '../stylesheets/Events.css'
import '../stylesheets/Form.css';
import { useNavigate, useLoaderData } from 'react-router-dom';
import Header from '../components/Header';
import { ClientContext } from '../App';
import { useContext } from 'react';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import { IOrganisation, Permission } from '../models/models';

function EditOrganisation() {
    interface OrgData {
        org: IOrganisation;
        permissions: Permission[];
    }

    const data = useLoaderData() as OrgData;
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
    
    interface EditOrgFormData {
        name: string;
        description: string;
    };

    const [formData, setFormData] = useState<EditOrgFormData>({name: data.org.name, description: data.org.description});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        client.put(`/organisation/authorized`, { ...formData, id: data.org.id }).then(r => {
            if (r.status === 200) {
                toast.success(r.data[0], toastConfig);
                nav(`/organisations/${data.org.id}`);
            }
        }).catch(err => {
            const messages = err.response.data.join("\n");
            toast.error(messages, toastConfig);
        });
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this organisation?")) {
            try {
                const response = await client.delete(`/organisation/${data.org.id}/authorized`);
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
            <main className="new-organisation form-container">
                <ToastContainer />
                <h1>Edit organisation</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input name="name" type="text" onChange={handleChange} defaultValue={data.org.name} placeholder="Organisation name" required />
                    <textarea name="description" rows={4} onChange={handleChange} defaultValue={data.org.description} placeholder="Description" />
                    <input type="submit" value="Update organisation" />
                </form>

                <span onClick={handleDelete} className="delete-btn">Delete organisation</span>
            </main>
        </div>
    );
}

export default EditOrganisation;

