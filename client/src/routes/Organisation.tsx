import '../stylesheets/Organisations.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLoaderData } from 'react-router-dom';
import { Organisation } from '../../../src/server/model/organisationModels';

function OrganisationPage() {
    const organisation = useLoaderData() as Organisation;
    
    const defaultHeaderContent = (
		<>
		{/* <div className="back-button">
            <a
        </div> */}
		</>
	);

    return (
        <div className="App">
            <Header />
            <main className="organisation">
                <div className="organisation-title">
                    <div>
                        <img src={organisation.picture} className="organisation-img" />
                        <h2>{organisation.name}</h2>
                    </div>
                    <div>
                        <i className="bi bi-people"></i>
                        <span>1337</span>
                        <a href={`/organisations/${organisation.id}/unfollow`} className="organisation-follow-btn following">Following</a>
                    </div>
                </div>

                <p>text about the organisation here (todo: add property)</p>

                <h3>Contact</h3>
                <div>
                    <i className="bi bi-envelope"></i>
                    <span>sample@email.com (no property yet)</span>
                </div>
                <div>
                    <i className="bi bi-globe2"></i>
                    <span>sample URL (no property yet)</span>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default OrganisationPage;
