# Food Share

**Food Share** is a food donation platform aimed at fighting hunger (SDG 2 — Zero Hunger). It allows restaurants, supermarkets, and individuals to donate surplus food to shelters, NGOs, or families in need. The goal is to connect those who have excess food with those who need it efficiently and safely.

---

## Features

- User registration and login (donor, shelter, admin)
- Create, edit, and delete food donations
- View nearby donations on a map
- Filter donations by food type, distance, or expiration date
- Reserve and confirm donation pickup
- Profile page to edit user information
- Home page explaining the project with a "Start Donating" button
- Basic notifications for reservations and pickups

---

## Main Screens

- **Home**: overview and action buttons  
- **Login / Register**: user authentication  
- **Donations**: list of available foods  
- **New Donation**: form to create a donation (name, category, quantity, expiration, image, location)  
- **Donor Dashboard**: manage your donations  
- **Shelter Dashboard**: view and manage reserved donations  
- **Profile**: edit personal information  
- **About**: project mission explanation  

---

## Technologies Used

- Frontend: React + React Router + Tailwind CSS  
- Backend: Node.js + Express (temporary/mock data)  
- Integration: Google Maps API for donation locations  
- Authentication: JWT  
- Mock data for testing and demonstration without a real database  

> **Note:** Real data persistence can be implemented later using databases like Supabase, MongoDB, or Firebase.

---

## How to Run the Project

1. Clone the repository:

```bash
git clone <REPOSITORY_URL>
cd food-share

