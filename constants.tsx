import { SOPStep } from './types';

export const INITIAL_SOP_STEPS: SOPStep[] = [
  {
    id: 1,
    title: "1. Morning Routine (8:30 AM)",
    points: [
      "Wait for the 8:30 AM order cutoff time.",
      "CRITICAL: Refresh the browser page once after 8:30 AM to load the latest data.",
      "Ensure your tablet is charged and connected to Wi-Fi.",
    ],
    image: "sop-images/oms_dispatcher_search.png"
  },
  {
    id: 2,
    title: "2. Identify Assignments",
    points: [
      "Check the Weekly Tour Plan sheet.",
      "Driver (Top Row): Person driving the vehicle.",
      "Packator (Bottom Row): You! (Dispatcher packing the tour).",
      "Assignments: List of companies in the column between the Driver and Packator."
    ],
    image: "sop-images/weekly_plan_roles.png"
  },
  {
    id: 3,
    title: "3. Locate Branch in OMS",
    points: [
      "Go to the 'Dispatcher' tab in the OMS.",
      "Check the date (top right) is correct.",
      "Use the search bar to find your assigned company.",
    ],
    image: "sop-images/oms_dispatcher_search.png"
  },
  {
    id: 4,
    title: "4. Preparation & Scanner Setup",
    points: [
      "Collect empty boxes from the store based on order size.",
      "Apply labels to the boxes.",
      "Open 'Inside Mobile' app on your tablet.",
      "Scan the QR code on the tablet with your Pro-Glove scanner to pair."
    ]
  },
  {
    id: 5,
    title: "5. Start Scanning & Cold Box",
    points: [
      "Click the green 'START SCANNING' button.",
      "Prompt: 'Scan Box' -> Scan the QR code on the Cold Box label.",
      "Fetch Cold dishes (Salads/Desserts) as indicated by the Red Box counter.",
      "Green Box = Scanned Quantity. Red Box = Remaining Quantity."
    ],
    image: "sop-images/box_scan_prompt.png"
  },
  {
    id: 6,
    title: "6. Cold Box Packing Rules",
    points: [
      "Pack all Cold Addons (Salads, Desserts, Drinks) in the Cold Box.",
      "Never put Hot dishes in the Cold Box.",
      "Close the box once the Green count matches the Total."
    ],
    image: "sop-images/scanning_interface.png"
  },
  {
    id: 7,
    title: "7. Hot Box Transition",
    points: [
      "System will prompt for the Hot Box.",
      "Bring the Hot Box for the same company.",
      "Scan the QR code on the Hot Box label."
    ]
  },
  {
    id: 8,
    title: "8. Red Plate & Hot Dish Rules",
    points: [
      "Red Plate Rule: Place Red Plate at bottom of Hot Box.",
      "Workaround: If asked to scan Red Plate, RE-SCAN the Hot Box QR code.",
      "Scanning Order: ALWAYS scan Dish Letter QR First, then scan Bowl QR.",
      "Hot Addons: Pack Chicken, Rice, Soup, Samosas with Hot Dish."
    ],
    image: "sop-images/red_plate_workaround.png"
  },
  {
    id: 9,
    title: "9. Completion",
    points: [
      "Ensure all Red counters are at 0.",
      "Verify physically that boxes are packed correctly."
    ]
  },
  {
    id: 10,
    title: "10. Paperwork & Stickers",
    points: [
      "Paperwork: Place ALL delivery papers in ONE box (can be Hot or Cold box).",
      "Stickers: Stick delivery stickers on the FRONT side of every box.",
      "Rule: Every box must have AT LEAST one sticker.",
      "Excess Stickers: If you have extra stickers (e.g., from addons), put 2-3 stickers on one box."
    ]
  },
  {
    id: 11,
    title: "11. Trolley & Packator Finish",
    points: [
      "Load all completed and labeled boxes into the Trolley.",
      "Double check you haven't left any boxes behind.",
      "Proceed to your next assigned company in the Tour Plan."
    ]
  },
  {
    id: 12,
    title: "12. Tiramizoo: Start Tour",
    points: [
      "Open Tiramizoo App & Login.",
      "Condition Check: You will see 'Do you meet these conditions?'.",
      "Action: Click 'Confirm'."
    ],
    image: "sop-images/tiramizoo_conditions.png"
  },
  {
    id: 13,
    title: "13. Tiramizoo: Dashboard",
    points: [
      "View Dashboard: Top item is the Kitchen (Pickup Point).",
      "First Stop: Friedrich-Engels-Straße 24 (or similar).",
      "Verify '12 min' service time is visible.",
      "Action: Click on the first stop to begin loop."
    ],
    image: "sop-images/tiramizoo_dashboard.png"
  },
  {
    id: 14,
    title: "14. Tiramizoo: Scan Box",
    points: [
      "You will see the list of companies to collect (e.g., Jameda, Digital Charging).",
      "Action: Click the 'Scan' button (scanner icon) to open camera.",
      "Scan the QR codes of YOUR assigned driving companies.",
      "Green Check: Box is successfully scanned."
    ],
    image: "sop-images/tiramizoo_scanner.png"
  },
  {
    id: 15,
    title: "15. Tiramizoo: Finish Loading",
    points: [
      "Verify all companies have Green Checks or correct box counts (e.g. 3|3).",
      "Scroll to bottom.",
      "Action: Click 'Finish' to complete the Pickup phase."
    ],
    image: "sop-images/tiramizoo_finish.png"
  },
  {
    id: 16,
    title: "16. Departure & Navigation",
    points: [
      "Time Selection: Select '12 min' (Loading Time) and Submit.",
      "Route: Click 'Navigate' on the next stop to start driving."
    ]
  },
  {
    id: 17,
    title: "17. Delivery & Proof",
    points: [
      "Navigate to stop. Check app/box for entry codes.",
      "Drop-off: Place boxes at the required spot.",
      "App Action: Select ALL delivered boxes -> Choose 'Delivered on reception'.",
      "Time: Select '6 minute'.",
      "Photo: Click Camera Icon -> Take photo of boxes -> Submit."
    ]
  },
  {
    id: 18,
    title: "18. Return Data",
    points: [
      "Collect empty boxes from the company if available.",
      "Record the count of collected boxes for each company.",
      "Report: Give the final counts to the Manager at the end of the tour."
    ]
  }
];
