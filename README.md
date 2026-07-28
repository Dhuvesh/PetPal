# PetPal

## Project Definition

PetPal is a full-stack pet adoption and support platform designed to bring pet seekers, animal shelters, and NGO representatives together in a trusted, transparent environment. The application combines user onboarding, pet listing, adoption request handling, real-time communication, donation management, and veterinary support into a single end-to-end service.

## The Transparency Problem

Many pet adoption websites struggle with trust and transparency. Potential adopters often face issues such as:

- incomplete or outdated pet information
- unclear adoption request status
- lack of verified shelter or NGO details
- poor communication between adopters and pet owners
- limited visibility into donation collection and use

Without clear processes and honest data sharing, people can lose confidence in the adoption system and animals may miss opportunities for care.

## How PetPal Maintains Transparency

PetPal is built to improve clarity and trust across the adoption journey by implementing:

- **Verified user types**: separate workflows for regular users and NGO representatives help distinguish verified shelters from general adopters.
- **Detailed pet profiles**: pets include photos, breed, age, location, owner contact details, and care information.
- **Adoption request tracking**: applicants can submit, view, and withdraw adoption requests, while NGOs can review and update request status.
- **Real-time chat**: buyers and sellers can communicate directly through chat tied to adoption cases, ensuring conversations remain connected to the right adoption request.
- **Donation visibility**: donors can contribute through the platform with Stripe payment handling and receive email receipts for transparency.
- **Contact management**: users can submit support requests and NGOs can monitor incoming messages.
- **Admin dashboard**: NGOs gain access to adoption, donations, contact, and pet management tools that make operations more transparent.

## Project Structure

The repository is divided into two main parts:

### Client/

A React + Vite frontend that includes:

- `src/App.jsx`: application routes, protected navigation, NGO dashboard handling
- `src/pages/`: page components for landing, auth, pet adoption, rehoming, donations, vet services, contact, chat, and NGO admin pages
- `src/components/`: reusable UI components such as navigation, sidebar, notifications, and status indicators
- `src/store/`: Zustand stores for authentication, theme selection, and real-time chat state
- `src/lib/axios.js`: API client configuration

### Server/

An Express backend with MongoDB support, including:

- `index.js`: server initialization, middleware setup, route registration, and Socket.IO configuration
- `routes/`: route modules for auth, adoption, donations, pets, contacts, vet services, and chat
- `controllers/`: business logic for each feature area, including authentication, pet listing, donations, adoption workflows, chat management, and contact handling
- `models/`: Mongoose schemas for User, Pet, Adoption, Donation, Contact, Chat, and Message
- `lib/`: database connection and Cloudinary configuration
- `utils/`: email receipt service for donation confirmations

### Infrastructure & Integrations

- MongoDB via Mongoose for persistent data storage
- Stripe for payment intent creation, donation confirmation, and recurring subscriptions
- Cloudinary for image uploads and asset storage
- Socket.IO for real-time messaging
- Google Places API for vet clinic discovery
- Nodemailer for donation receipt emails

## Advantages

PetPal offers several strengths over traditional pet adoption systems:

- **End-to-end adoption workflow** from browsing to chat-enabled approval
- **Real-time communication** between adopters and owners
- **Donation management with receipts** to build trust and accountability
- **NGO-specific dashboard** for shelter operations and transparency
- **Flexible user roles** that support both individual adopters and NGOs
- **Reliable media and document handling** using Cloudinary
- **Secure authentication** with JWT-based session cookies

## Future Improvements

PetPal is already rich in features, and the next improvements may include:

- **Enhanced verification for NGOs**, including admin review and verification badges
- **Full access control and role-based permissions** on protected routes
- **Improved adoption analytics** and reporting pages for NGOs
- **More robust search and filtering** for pets by breed, location, size, and temperament
- **Mobile-responsive chat notifications** and unread message badges
- **Support for photo galleries and video stories** on pet profiles
- **Automated donation impact tracking** to show how contributions are used
- **More secure environment handling** and removal of sensitive credentials from source control
- **Unit and integration tests** for backend and frontend features

## Getting Started

To run the project locally, install dependencies separately in both `Client/` and `Server/`, configure environment variables, and start each app. The client consumes the server API through `VITE_API_URL`.

---

PetPal is designed to make pet adoption more transparent, accountable, and compassionate for everyone involved.
