import type { ActivityEntry, Booking, DemoState, Enquiry, FollowUp } from "../data/types";

export type DemoAction =
  | { type: "enquiry/add"; enquiry: Enquiry }
  | { type: "enquiry/update"; id: string; patch: Partial<Enquiry>; activity?: ActivityEntry }
  | { type: "booking/add"; booking: Booking; activity?: ActivityEntry }
  | { type: "booking/update"; id: string; patch: Partial<Booking> }
  | { type: "followUp/add"; followUp: FollowUp }
  | { type: "followUp/update"; id: string; patch: Partial<FollowUp> }
  | { type: "state/replace"; state: DemoState };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "enquiry/add":
      return { ...state, enquiries: [action.enquiry, ...state.enquiries] };

    case "enquiry/update": {
      const now = new Date().toISOString();
      return {
        ...state,
        enquiries: state.enquiries.map((enquiry) =>
          enquiry.id === action.id
            ? {
                ...enquiry,
                ...action.patch,
                updatedAt: now,
                activity: action.activity ? [...enquiry.activity, action.activity] : enquiry.activity,
              }
            : enquiry,
        ),
      };
    }

    case "booking/add": {
      const { booking, activity } = action;
      return {
        ...state,
        bookings: [...state.bookings, booking],
        // Link the originating enquiry (if any) and move it to Booked.
        enquiries: booking.enquiryId
          ? state.enquiries.map((enquiry) =>
              enquiry.id === booking.enquiryId
                ? {
                    ...enquiry,
                    status: "Booked",
                    bookingId: booking.id,
                    updatedAt: booking.createdAt,
                    activity: activity ? [...enquiry.activity, activity] : enquiry.activity,
                  }
                : enquiry,
            )
          : state.enquiries,
      };
    }

    case "booking/update":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.id ? { ...booking, ...action.patch } : booking,
        ),
      };

    case "followUp/add":
      return { ...state, followUps: [action.followUp, ...state.followUps] };

    case "followUp/update":
      return {
        ...state,
        followUps: state.followUps.map((followUp) =>
          followUp.id === action.id ? { ...followUp, ...action.patch } : followUp,
        ),
      };

    case "state/replace":
      return action.state;

    default:
      return state;
  }
}
