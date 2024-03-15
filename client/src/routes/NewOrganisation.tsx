import React, { useContext, useState } from 'react';
import '../stylesheets/NewOrganisation.css'
import '../stylesheets/Form.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import OrganisationCard from '../components/OrganisationCard';
import { IOrganisation } from '../models/models';
import { ClientContext } from '../App';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';

// TODO: load baseURL from client (current issue: ClientContext must be inside NewOrganisation element
//       and the previewOrg object will reset to default if it is not outside)
const defaultPic = "/public/images/default-org-profile-picture.png";
const defaultBan = "http://localhost:8080/public/images/default-org-banner.png";
let previewOrg: IOrganisation = { id: -1, name: "Title", members: [], roles: [], picture: defaultPic, banner: defaultBan, description : "" }

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
    const [preview, setPreview] = useState<IOrganisation | null>(previewOrg);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "name") {
            previewOrg.name = value;
            if (value === "" && previewOrg.banner === defaultPic) {
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
            console.log(selectedFile);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                previewOrg.banner = reader.result as string;
                setPreview(previewOrg);
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const toastConfig: ToastOptions = { position: "bottom-left", autoClose: 3000, theme: "colored" };
        client.post(client.defaults.baseURL + "/organisation/authorized/new", formData).then(r => {
            if (r.status === 200) {
                nav(`/organisations/${r.data.orgId}`);
            }
        }).catch(err => {
            toast.error(err.response.data.msg, toastConfig);
        });
    };

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="new-organisation form-container">
                <ToastContainer />
                <h1>New organisation</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input name="name" type="text" onChange={handleChange} placeholder="Organisation name" required />
                    <textarea name="description" rows={4} onChange={handleChange} placeholder="Description" required />
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
