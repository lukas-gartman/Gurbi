import { useContext, useState } from 'react';
import { ClientContext } from '../App';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { IEvent, IUser, Permission } from "../models/models";
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';

function EventPage() {
    interface EventData {
        event: IEvent;
        user: IUser;
        permissions: Permission[];
    }

    const data = useLoaderData() as EventData;
    const client = useContext(ClientContext);
    const toastConfig: ToastOptions = { position: "bottom-left", autoClose: 3000, theme: "colored" };
    const editPermissions = [Permission.ChangeEventName, Permission.ChangeEventLocation, Permission.ChangeEventDescription, Permission.ChangeEventPrice, Permission.ChangeEventDate];
    const canEdit = data.permissions.some(p => editPermissions.includes(p));

    const [isMember, setIsMember] = useState(data.event.host.members.some(member => member.userId === data.user.id)); 
    const [memberCount, setMemberCount] = useState(data.event.host.members.length);

    let nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };
    const navOptions = () => {
        // TODO: option floating menu
    };

    const header = (
        <>
        <div className="header-row">
            <i id="back-button" onClick={goBack} className="bi bi-arrow-left-short" />
        </div>
        <a id="options-button" className="bi bi-three-dots-vertical" />
        </>
    );

    const handleJoin = async () => {
        try {
            await client.post("/organisation/authorized/user", { nickName: "", organisationId: data.event.host.id });
            toast.success("Joined organisation!", toastConfig);
            setIsMember(true);
            setMemberCount(memberCount + 1);
        } catch (e: any) {
            toast.error(e.response.data, toastConfig);
        }
    };

    const handleLeave = async () => {
        try {
            await client.delete(`/organisation/${data.event.host.id}/authorized/user`);
            toast.success("Left organisation!", toastConfig);
            setIsMember(false);
            setMemberCount(memberCount - 1);
        } catch (e: any) {
            toast.error(e.response.data, toastConfig);
        }
    };

    const joinButton = (
        isMember ? (
            <button onClick={handleLeave} className="organisation-join-btn">Leave organisation</button>
        ) : (
            <button onClick={handleJoin} className="organisation-join-btn join">Join organisation</button>
        )
    );

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="event">
                <ToastContainer />
                <div className="event-info-header">
                    <div className="event-info-block-left">
                        <h2>{data.event.name}</h2>

                        <div className="event-card-row">
                            <img src={client.defaults.baseURL + data.event.host.picture} className="event-host-img" alt="Host" />
                            <span>{data.event.host.name}</span>
                        </div>
                        
                        <div className="event-card-row">
                            <i className="bi bi-calendar3 event-info-icon"></i>
                            <span>{data.event.dateTime.toLocaleString("en-SE", {dateStyle: "medium", timeStyle: "short"})}</span>
                        </div>

                        <div className="event-card-row">
                            <i className="bi bi-geo-alt event-info-icon" />
                            <span>{data.event.location}</span>
                        </div>
                    </div>
                    <div className="event-info-block-picture">
                        <img src={client.defaults.baseURL + data.event.picture} className="event-picture" alt="Event" />
                    </div>
                    <div className="event-info-block-right">
                        { canEdit &&
                        <div>
                            <NavLink to={`/events/${data.event.id}/edit`} className="edit-event-btn">Edit event</NavLink>
                        </div>}
                    </div>
                </div>

                <h3>About</h3>
                <p className="event-description">{data.event.description}</p>
                
                <h3>Contact</h3>
                <div className="event-card-row">
                    <i className="bi bi-person"></i>
                    <span>{data.event.host.name}</span>
                </div>
                <div className="event-card-row">
                    <i className="bi bi-envelope"></i>
                    <span>sample@email.com (no property yet)</span>
                </div>

                <h3>Discussion</h3>
                <p>discussion here</p>

                <h3>Organiser</h3>
                <NavLink to={"/organisations/" + data.event.host.id} className="event-card">
                    <img className="event-organiser-img" src={client.defaults.baseURL + data.event.host.picture} alt="Host" />
                    <div className="event-info">
                        <span>{data.event.host.name}</span>
                        <span>organisation section here</span>
                    </div>
                    <div className="event-organiser-options">
                        <i className="bi bi-three-dots-vertical"></i>
                        <div>
                            <i className="bi bi-people"></i>
                            <span>{memberCount}</span>
                            { joinButton }
                        </div>
                    </div>
                </NavLink>
            </main>
            <Footer />
        </div>
    );
}

export default EventPage;
