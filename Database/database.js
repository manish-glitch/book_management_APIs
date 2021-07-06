let books =[
    {
        ISBN: "12345Book",
        title: "getting started with MERN",
        pubDate: "2021-07-07",
        language: "en",
        numPage: 250,
        author: [1, 2],//id of author
        publication:[1],
        category: ["tech", "programming", "education"],
    },
];

const authors = [
    {
        ID: 1,
        name: "manish",
        books: ["12345Book", "123456789Secret"],
    },
    {
        ID:2, name: "elon tatya", books:["12345Book"],
    },
];

const publications =[
    {
        id: 1,
        name: "spaceX",
        books: ["12345Book"],
    },
];

module.exports={books, authors, publications};