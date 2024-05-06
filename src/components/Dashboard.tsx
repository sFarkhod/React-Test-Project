import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../assets/css/Register.css";
import { useNavigate } from "react-router-dom";
import generateAuthHeaders from "../assets/hashCreator";
import { RequestMethods } from "../interfaces/IRequestMethods";
import {
  useGetBooksQuery,
  usePostBookMutation,
  useDeleteBookMutation,
  useGetSingleBookQuery,
} from "../store/services/bookApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

export default function Dashboard() {
  // necessary data
  const [isbn, setIsbn] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const key = useSelector((state: any) => state.user.key);
  const secret = useSelector((state: any) => state.user.secret);

  // hash for GET All Books
  const headers: any =
    key && secret
      ? generateAuthHeaders(RequestMethods.GET, "/books", null, key, secret)
      : {};

  // queries
  const {
    data,
    refetch: HereRefetch,
    error,
    isLoading,
    isSuccess,
  } = useGetBooksQuery<any>(headers);
  const [postBook, { isLoading: isAddingBook }] = usePostBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  // const { data: singleBookData, isLoading: singleBookLoading } = useGetSingleBookQuery<any>();

  const handleAddBook = () => {
    const body = { isbn };
    // hash for POST Book
    const headersForPost: any =
      key && secret
        ? generateAuthHeaders(RequestMethods.POST, "/books", body, key, secret)
        : {};
    // query
    postBook({ body, Key: key, Sign: headersForPost.Sign }).then(() =>
      HereRefetch()
    );
  };

  const handleDeleteBook = (id: any) => {
    // hash for DELETE Book
    const headersForDelete: any =
      key && secret
        ? generateAuthHeaders(
            RequestMethods.DELETE,
            `/books/${id}`,
            null,
            key,
            secret
          )
        : {};
    headersForDelete.id = id;

    console.log(headersForDelete);

    setTimeout(() => {
      deleteBook(headersForDelete).then(() => HereRefetch());
    }, 100);
  };

  const handleSearch = () => {
    // hash for GET All Books
    const headersForSearch: any =
      key && secret
        ? generateAuthHeaders(RequestMethods.GET, `/books?search=${searchTerm}`, null, key, secret)
        : {};
  }

  const handleViewBook = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  useEffect(() => {
    HereRefetch();
  }, [isbn]);

  return (
    <>
      <div className="dashboard-container">
        <div className="input-button-wrapper">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          <TextField
            label="ISBN"
            variant="outlined"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleAddBook}
            disabled={!isbn || isAddingBook}
          >
            Add Book
          </Button>
        </div>
        <div className="table-container">
          {data?.data != null ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Published</TableCell>
                    <TableCell>Pages</TableCell>
                    <TableCell>Actions</TableCell>{" "}
                    {/* New column for actions */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data.map((book: any) => (
                    <TableRow key={book.book.id}>
                      <TableCell>{book.book.title}</TableCell>
                      <TableCell>{book.book.author}</TableCell>
                      <TableCell>{book.book.published}</TableCell>
                      <TableCell>{book.book.pages}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleViewBook(book)}>
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            console.log(
                              "Edit action for book ID:",
                              book.book.id
                            )
                          }
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteBook(book.book.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No books available.</p>
          )}
        </div>
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Book Details
          </Typography>
          {selectedBook && (
            <>
              <Typography variant="subtitle1">
                Title: {selectedBook.book.title}
              </Typography>
              <Typography variant="subtitle1">
                Author: {selectedBook.book.author}
              </Typography>
              <Typography variant="subtitle1">
                Published: {selectedBook.book.published}
              </Typography>
              <Typography variant="subtitle1">
                Pages: {selectedBook.book.pages}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
