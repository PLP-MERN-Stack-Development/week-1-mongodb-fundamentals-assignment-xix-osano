//Task 2: Basic CRUD Operations

// Find all books in a specific genre (e.g., "Fiction")
    db.books.find({ genre: "Fiction" });

// Find books published after a certain year (e.g., 1940)
    db.books.find({ published_year: { $gt: 1940 } });

// Find books by a specific author (e.g., "George Orwell")
    db.books.find({ author: "George Orwell" });

// Update the price of a specific book (e.g., "The Great Gatsby" to $12.99)
    db.books.updateOne(
      { title: "The Great Gatsby" },
      { $set: { price: 12.99 } }
    );

// Delete a book by its title (e.g., "Animal Farm")
    db.books.deleteOne({ title: "Animal Farm" });


//Task 3: Advanced Queries

// 1.Find books that are both in stock and published after 1970
    db.books.find({
      in_stock: true,
      published_year: { $gt: 1970 }
    });

// 2.Use projection to return only the title, author, and price fields
    db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });


// 3.Implement sorting to display books by price
    //Ascending (lowest price first)
        db.books.find().sort({ price: 1 });
    
    //Descending (highest price first)
        db.books.find().sort({ price: -1 });
        
    //Combined with projection
        db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 });

// 4.Using the `limit` and `skip` methods to implement pagination (5 books per page)
    //Page 1 (first 5 books)
        db.books.find().limit(5);

    //Page 2 (next 5 books)
        db.books.find().skip(5).limit(5);

    //Page 3 (books 11-15)
        db.books.find().skip(10).limit(5);


//Task 4: Aggregation Pipeline

// 1.An aggregation pipeline to calculate the average price of books by genre
    db.books.aggregate([
      {
        $group: {
          _id: "$genre", // Group by the 'genre' field
          averagePrice: { $avg: "$price" } // Calculate the average of the 'price' field
        }
      },
      {
        $sort: { averagePrice: -1 } // Sort by average price descending
      }
    ]);

// 2.An aggregation pipeline to find the author with the most books in the collection
    db.books.aggregate([
      {
        $group: {
          _id: "$author", // Group by the 'author' field
          bookCount: { $sum: 1 } // Count the number of books for each author
        }
      },
      {
        $sort: { bookCount: -1 } // Sort by book count in descending order
      },
      {
        $limit: 1 // Take only the top result (author with most books)
      }
    ]);

// 3.Implement a pipeline that groups books by publication decade and counts them
    db.books.aggregate([
      {
        $project: { // Add a 'decade' field
          title: 1, // Include title for reference
          published_year: 1,
          decade: {
            $subtract: [
              "$published_year",
              { $mod: ["$published_year", 10] } // e.g., 1987 becomes 1980
            ]
          }
        }
      },
      {
        $group: {
          _id: "$decade", // Group by the calculated decade
          count: { $sum: 1 } // Count books in each decade
        }
      },
      {
        $sort: { _id: 1 } // Sort by decade ascending
      }
    ]);

//Task 5: Indexing

// 1.Create an index on the `title` field for faster searches
    db.books.createIndex({ title: 1 }); // 1 for ascending order
    //MongoDB will use this index automatically for queries filtering by `title`

// 2.Create a compound index on `author` and `published_year`**:
    //This is useful for queries that filter by author and sort/filter by publication year.
    db.books.createIndex({ author: 1, published_year: -1 }); //Author ascending, published_year descending (to find recent books by an author)

// 3.Use the `explain()` method to demonstrate performance improvement
        db.books.find({ title: "The Great Gatsby" }).explain("executionStats");
