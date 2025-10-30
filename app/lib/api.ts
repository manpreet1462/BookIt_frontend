const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; 

export interface Slot {
  _id: string;
  date: string;
  time: string;
  capacity: number;
  bookedCount: number;
  price: number;
}

export interface Experience {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  location: string;
  price: number;
  slots: Slot[];
  createdAt?: string;
}

export interface BookingData {
  experienceId: string;
  slotId: string; 
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  promoCode?: string;
  quantity?: number;
}

export interface PromoValidation {
  valid: boolean;
  code?: string;
  discount?: number;
  finalTotal?: number;
  message?: string;
}

export const getExperiences = async (): Promise<Experience[]> => {
  const res = await fetch(`${API_BASE_URL}/experiences`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch experiences");
  return res.json();
};

export const getExperienceById = async (id: string): Promise<Experience> => {
  const res = await fetch(`${API_BASE_URL}/experiences/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch experience");
  return res.json();
};

export const createBooking = async (bookingData: BookingData) => {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create booking");
  }

  return res.json();
};

export const validatePromoCode = async (
  code: string,
  amount: number
): Promise<PromoValidation> => {
  const res = await fetch(`${API_BASE_URL}/promo/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, amount }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to validate promo code");
  }

  return res.json();
};
