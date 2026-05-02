export type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
};

export const TABLE_COLUMNS = ["ID", "Name", "Email", "Role", "Status"] as const;

export const TABLE_DATA: UserRow[][] = [
    // Page 1
    [
        { id: 1, name: "Sarah Chen", email: "sarah.chen@mail.com", role: "Engineer", status: "Active" },
        { id: 2, name: "Marcus Rivera", email: "m.rivera@mail.com", role: "Designer", status: "Active" },
        { id: 3, name: "Emily Watson", email: "e.watson@mail.com", role: "Manager", status: "Active" },
        { id: 4, name: "James Park", email: "j.park@mail.com", role: "Analyst", status: "Inactive" },
        { id: 5, name: "Aisha Patel", email: "a.patel@mail.com", role: "Engineer", status: "Active" },
    ],
    // Page 2
    [
        { id: 6, name: "Lucas Torres", email: "l.torres@mail.com", role: "Designer", status: "Active" },
        { id: 7, name: "Mia Johnson", email: "mia.j@mail.com", role: "Manager", status: "Active" },
        { id: 8, name: "Noah Kim", email: "n.kim@mail.com", role: "Engineer", status: "Inactive" },
        { id: 9, name: "Zara Ahmed", email: "z.ahmed@mail.com", role: "Analyst", status: "Active" },
        { id: 10, name: "Ethan Brooks", email: "e.brooks@mail.com", role: "Designer", status: "Active" },
    ],
    // Page 3
    [
        { id: 11, name: "Olivia Müller", email: "o.muller@mail.com", role: "Engineer", status: "Active" },
        { id: 12, name: "Kai Nakamura", email: "k.naka@mail.com", role: "Manager", status: "Active" },
        { id: 13, name: "Sofia Rossi", email: "s.rossi@mail.com", role: "Analyst", status: "Inactive" },
        { id: 14, name: "Liam O'Brien", email: "l.obrien@mail.com", role: "Designer", status: "Active" },
        { id: 15, name: "Priya Sharma", email: "p.sharma@mail.com", role: "Engineer", status: "Active" },
    ],
    // Page 4
    [
        { id: 16, name: "Alex Volkov", email: "a.volkov@mail.com", role: "Manager", status: "Active" },
        { id: 17, name: "Chloe Dubois", email: "c.dubois@mail.com", role: "Engineer", status: "Active" },
        { id: 18, name: "Daniel Okafor", email: "d.okafor@mail.com", role: "Analyst", status: "Inactive" },
        { id: 19, name: "Hana Tanaka", email: "h.tanaka@mail.com", role: "Designer", status: "Active" },
        { id: 20, name: "Ryan Cooper", email: "r.cooper@mail.com", role: "Engineer", status: "Active" },
    ],
    // Page 5
    [
        { id: 21, name: "Isabella Ferrero", email: "i.ferrero@mail.com", role: "Manager", status: "Active" },
        { id: 22, name: "Omar Hassan", email: "o.hassan@mail.com", role: "Analyst", status: "Active" },
        { id: 23, name: "Maya Singh", email: "m.singh@mail.com", role: "Engineer", status: "Inactive" },
        { id: 24, name: "Tyler Greene", email: "t.greene@mail.com", role: "Designer", status: "Active" },
        { id: 25, name: "Luna Reyes", email: "l.reyes@mail.com", role: "Engineer", status: "Active" },
    ],
];

export const TOTAL_PAGES = TABLE_DATA.length;
