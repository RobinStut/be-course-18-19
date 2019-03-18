# Week 4

> An SSL error has occurred and a secure connection to the server
> cannot be made.
>
> — [William Shakespeare][quote-author]

## Table of Contents

*   [Inspiration](#inspiration)
*   [Comic](#comic)
*   [Slides](#slides)
*   [Assignments](#assignments)
*   [Homework](#homework)

## Inspiration

[![][inspiration-cover]][inspiration-link]

> [`qw3rtman/git-fire`][inspiration-link] by
> [**@qw3rtman**][inspiration-author].

## Comic

[![][comic-cover]][comic-link]

> Exploits of a Mom by [**@xkcd**][comic-author].

## Slides
*   [**Lecture-4**][slides-lecture]
*   [**Lab-4**][slides-lab]

## Assignments

### Alternatives

Take about 0:45h to investigate the different types of database.
What databases are out there, and how can they be categorised? Why do you think we picked MongoDB?

Make sure your research answers questions like:

*   What databases are there?
*   How do databases compare to each other in features, type (SQL, NoSQL, or
    something else?), popularity, funding, ease of use, or other factors?
*   Which of those factors do or do not matter to you?

## Homework

### Storage

[![][storage-cover]][storage-cover-source]

> Library by [**@jzamora**][storage-cover-author].

In this assignment you’ll store the user input in a `MongoDB` database.

#### Synopsis

*   **Homework**
*   **Time**: 8:00h
*   **Goals**: **subgoal 8** and **subgoal 13**
*   **Due**: before [lab 5][w5lab]

#### Tips

*   [`mongodb-server`](examples/mongodb-server)
    (**example**)
*   Stuck?  See the [Bugs](/readme#communication) section of the course readme to find a list of
    troubleshooting tips

#### Description

Take ± 8 hours to add an `MongoDB` database to your project.

All of your data is going to be stored in a database called MongoDB. You have two options: go with a database as a service [DBaaS](https://www.mongodb.com/cloud/atlas) or use [MongoDB locally](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/). You can use a [MongoDB GUI](https://www.mongodb.com/products/compass) to see and manipulate your data.

> Store sensitive information such as your database URI, password and username in a `.env` using the [`dotenv`](https://www.npmjs.com/package/dotenv) package. Make sure you add the file to your `.gitignore`. If you commit your environment variables it's hard to undo!

**Local**

_When you are running locally, make sure you create a folder for MongoDB to store data and specify this path when starting `mongod`._

You can store this `./data` folder inside of your repository but make sure to put it in your `.gitignore`.

```
mongod --dbpath <path to data directory>
```

Have a look at the    [`mongodb-server`](examples/mongodb-server) example for more detailed instructions.

**DBaaS**

After you've tested your database locally you can migrate to a _Database as a service_. Instead of having the database stored locally on your laptop, it saves your data to _the cloud_.

> [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and [Mlab](https://mlab.com/) are both good options. They offer free plans for prototypes. These are not meant to be used in production.

**Build**

You can use the [`mongodb`](https://www.npmjs.com/package/mongodb) package inside node to interface with your database. Additionally you can use [`mongoose`](https://www.npmjs.com/package/mongoose) it makes it a bit easier to model and your database.

**Research**

Include a diagram in your readme that explains how the database works
(**hint**: [Google Drawings][drawings]).

### Hand in

Commit your work early and often.
Push your work to GitHub.
Don’t worry if it’s not perfect.
Try and get as far as you can.

1. **Push your changes:**
Hand in your progess in your repository on GitHub under your username.

1. **Create an issue:**
Mark this assignment as complete by opening an issue on our [GitHub issue tracker][issues]. Fill in the issue template with the correct information. Make sure, in your repository, you include the resources used and update your `readme.md` and wiki with additional information.

3. **Feedback:**
Let us know what you thought of the homework, what part you spend a lot of time on and give us any feedback. Your project will be reviewed and receive feedback, so expect people to read it, and be ready for tips and tops!

[slides-lecture]: https://docs.google.com/presentation/d/1kN7TLs3_wbZykrM0BK7mQlofaXXSOq-BgsqsugUgh7Q/edit?usp=sharing

[slides-lab]: https://docs.google.com/presentation/d/1FqZ08Yf5IL6kCUjKO53VrWoipsn4foXQAFerjrmHRp8/edit?usp=sharing

[bugs]: readme.md#bugs

[quote-author]: https://twitter.com/shatterfront/status/816065700577972224

[inspiration-cover]: assets/images/git-fire.jpg

[inspiration-link]: https://github.com/qw3rtman/git-fire

[inspiration-author]: https://github.com/qw3rtman

[comic-cover]: https://imgs.xkcd.com/comics/exploits_of_a_mom.png

[comic-link]: https://xkcd.com/327/

[comic-author]: https://xkcd.com

[storage-cover]: https://images.unsplash.com/photo-1495741545814-2d7f4d75ea09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80

[storage-cover-source]: https://unsplash.com/photos/GWOTvo3qq7U

[storage-cover-author]: https://unsplash.com/@jzamora

[w5lab]: week-5.md#lab

[drawings]: https://docs.google.com/drawings

[issues]: https://github.com/cmda-bt/be-course-18-19/issues
