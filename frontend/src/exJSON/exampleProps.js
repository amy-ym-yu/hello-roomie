// user - JSON obj: name, pfp (link), username (?)
const userData = {
    name: "james charles the first of england",
    pfp: ""
};

// transaction - JSON obj: description / items (maybe 2 separate fields), amount, date, purchaser, users
const transactionData = {
    purchaser: {
        name: "billy",
        pfp: "https://i.pinimg.com/originals/31/eb/97/31eb9767cb1e55594bfcae11c9fe1967.jpg"
    },
    description: "bread",
    amount: "34.56",
    users: ["billy", "john", "james"],
    date: "2015-03-25T12:00:00Z"
};

const multiTrans = {
    activity: [{
        purchaser: {
            name: "billy",
            pfp: "https://i.pinimg.com/originals/31/eb/97/31eb9767cb1e55594bfcae11c9fe1967.jpg"
        },
        description: "bread",
        amount: "34.56",
        users: ["billy", "john", "james"],
        date: "2015-03-25T12:00:00Z"
    },
    {
        purchaser: {
            name: "jill",
            pfp: "https://i.pinimg.com/originals/31/eb/97/31eb9767cb1e55594bfcae11c9fe1967.jpg"
        },
        description: "lotion",
        amount: "4.2",
        users: ["jill", "jack", "james"],
        date: "2015-03-25T12:00:00Z"
    },
    {
        purchaser: {
            name: "lauren",
            pfp: "https://i.pinimg.com/originals/31/eb/97/31eb9767cb1e55594bfcae11c9fe1967.jpg"
        },
        description: "liquer",
        amount: "56",
        users: ["lauren", "john", "james"],
        date: "2015-03-25T12:00:00Z"
    }]
}

const allUserData = {
    allUsers: [
        {
            name: "stella",
            pfp: ""
        },
        {
            name: "james",
            pfp: ""
        },
        {
            name: "luca",
            pfp: ""
        },
        {
            name: "mona",
            pfp: ""
        }
]};

export { userData, transactionData, multiTrans, allUserData };