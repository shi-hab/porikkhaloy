import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureShowcase from './components/FeatureShowcase';
import VideoSection from './components/VideoSection';
import StudentReviews from './components/StudentReviews';
import PartnershipSection from './components/PartnershipSection';
import './styles/index.css';
import AppDownloadSection from './components/AppDownloadSection';
import Footer from './components/Footer';

export const LandingPage = () => {
    return (
        <div className=" bg-[#030014]  text-slate-100 selection:bg-indigo-600 selection:text-white mb-[-80px]">
            <Navbar />
            <main>
                <HeroSection />
                <FeatureShowcase />
                <VideoSection />
                <AppDownloadSection/>
                <StudentReviews />
                <PartnershipSection />
            </main>
            <Footer />
        </div>
    );
};