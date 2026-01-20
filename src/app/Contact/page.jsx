import React from 'react'
import Navbar from '../Components/NavBar'
import ContactSection from '../Components/ContactSection'
import Footer from '../Components/Footer'
function page() {
    return (
        <div>
            <Navbar active="Contact" />
            <ContactSection />
            <Footer/>

        </div>
    )
}

export default page