import React, { useContext, useState } from 'react';
import axios from 'axios';
import '../stylesheets/NewOrganisation.css'
import '../stylesheets/Form.css';
import { useNavigate, useLoaderData, redirect } from 'react-router-dom';
import Header from '../components/Header';
import OrganisationCard from '../components/OrganisationCard';
import { IOrganisation } from '../models/models';
import { ClientContext } from '../App';

// TODO: load baseURL from client (current issue: ClientContext must be inside NewOrganisation element
//       and the previewOrg object will reset to default if it is not outside)
const defaultPic = "http://localhost:8080/public/images/default-org-background.png";
let previewOrg: IOrganisation = { id: -1, name: "Title", members: [], roles: [], picture: defaultPic, description : "" }

function NewOrganisation() {
    const client = useContext(ClientContext);

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
    
    interface NewOrganisationFormData {
        name: string;
        description: string;
        picture: string;
    };

    const [formData, setFormData] = useState<NewOrganisationFormData>({name: "", description: "", picture: ""});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<IOrganisation | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "name") {
            previewOrg.name = value;
            if (value === "" && previewOrg.picture === defaultPic) {
                setPreview(null);
            } else {
                previewOrg.name = value;
                setPreview(previewOrg);
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handlePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                previewOrg.picture = reader.result as string;
                setPreview(previewOrg);
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            client.post(client.defaults.baseURL + "/organisation/authorized/new", formData)
            .then(r => { if (r.status == 200) {nav(`/organisations/memberships`) }})
            .catch(err => {console.error(err)});
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="new-organisation form-container">
                <h1>New organisation</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input name="name" type="text" onChange={handleChange} placeholder="Organisation name" required />
                    <textarea name="description" rows={4} onChange={handleChange} placeholder="Description" />
                    <input type="file" onChange={handlePicture} accept="image/*" />
                    {preview && (
                        <div className="preview-card">
                            <OrganisationCard org={previewOrg} />
                        </div>
                    )}

                    <input type="submit" value="Create organisation" />
                </form>
            </main>
        </div>
    );
}

export default NewOrganisation;
