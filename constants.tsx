
import { SOPStep } from './types';

export const INITIAL_SOP_STEPS: SOPStep[] = [
  {
    id: 1,
    title: "Tour & OMS Preparation",
    points: [
      "Check which tour is assigned to you (shown at the bottom of every tour).",
      "Open OMS → Dispatcher section.",
      "Search the assigned company.",
      "Refresh OMS compulsorily at 8:30 AM."
    ]
  },
  {
    id: 2,
    title: "Order Type Handling (Regular + Catering)",
    points: [
      "If a company has both regular and catering orders, they must be packed together.",
      "Regular and catering orders from the same company are NOT treated as separate companies for packing.",
      "Example: Omio and Omio-Catering orders must be packed in the same Omio hot and cold boxes."
    ]
  },
  {
    id: 3,
    title: "Sticker Rules",
    points: [
      "Minimum 2 hand-written stickers required per company.",
      "If hot and cold boxes are separate, stickers must be applied on both boxes.",
      "If all dishes are packed in one box, all stickers must be applied on that box.",
      "No box is allowed to leave the dispatch area without a sticker."
    ]
  },
  {
    id: 4,
    title: "ProGlove Connection",
    points: [
      "Open Insider Mobile App on the tablet.",
      "Scan the QR code to connect ProGlove with the tablet.",
      "Ensure connection is successful before scanning."
    ]
  },
  {
    id: 5,
    title: "Packing Decision Rules",
    points: [
      "Check total number of dishes ordered.",
      "If 10–12 dishes, pack all dishes in one box.",
      "If hot dishes are 6 or more, place a red plate at the bottom.",
      "Red plate is mandatory for all hot dishes."
    ]
  },
  {
    id: 6,
    title: "Scanning Process – Cold Dishes",
    points: [
      "Click Start Scanning.",
      "Scan Box QR Code (mandatory).",
      "Scan Cold Dish Letter QR Code.",
      "Scan Bowl QR Code.",
      "Follow on-screen instructions."
    ]
  },
  {
    id: 7,
    title: "Scanning Process – Hot Dishes",
    points: [
      "Scan the hot box again.",
      "Place red plate at the bottom.",
      "Scan Hot Dish Letter QR Code.",
      "Scan Bowl QR Code.",
      "Ensure physical dish count matches OMS for both hot and cold dishes."
    ]
  },
  {
    id: 8,
    title: "Add-ons Handling",
    points: [
      "Add-ons are currently closed manually.",
      "Add-on scanning will be implemented in the future."
    ]
  },
  {
    id: 9,
    title: "Storage & Segregation Rules",
    points: [
      "Chocolates: cold section only (always with cold dishes).",
      "FJ Raugh: dedicated section.",
      "Jarritos: bottom fridge.",
      "YFood drinks: dedicated section."
    ]
  },
  {
    id: 10,
    title: "Packing Rules",
    points: [
      "Only Chicken, Roasted Vegetables, Rice, and Soup are allowed in hot boxes.",
      "All other items must go into cold boxes.",
      "If packed in one box, chocolates must be placed in one corner of the cold section.",
      "Use a paper bag if there are many add-ons with mixed dishes.",
      "Make sure the dish is clean, no leakage, and has the dish letter.",
      "Do not tilt dishes. Distribution should be even."
    ]
  },
  {
    id: 11,
    title: "Final Dispatch Actions",
    points: [
      "After completing dispatch, collect all papers and QR stickers.",
      "Place all papers for the company in any one box.",
      "Apply stickers correctly as per packing configuration."
    ]
  },
  {
    id: 12,
    title: "Final OMS Verification",
    points: [
      "Refresh OMS.",
      "Verify all companies.",
      "Confirm all dishes are scanned and assigned to correct boxes.",
      "Dispatch is complete only after OMS and physical packing fully match."
    ]
  }
];
