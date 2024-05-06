import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../assets/css/Register.css";
import generateAuthHeaders from "../assets/hashCreator";
import { RequestMethods } from "../interfaces/IRequestMethods";
import {
  useGetBooksQuery,
  usePostBookMutation,
  useDeleteBookMutation,
  useGetSingleBookMutation,
  usePatchBookMutation,
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
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

export default function Dashboard() {
  // necessary data
  const [isbn, setIsbn] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedData, setSearchedData] = useState<any>();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("0");

  const key = useSelector((state: any) => state.user.key);
  const secret = useSelector((state: any) => state.user.secret);

  // hash for GET All Books
  const headers: any =
    key && secret
      ? generateAuthHeaders(RequestMethods.GET, "/books", null, key, secret)
      : {};

  // queries
  const { data, refetch: HereRefetch } = useGetBooksQuery<any>(headers);
  const [postBook, { isLoading: isAddingBook }] = usePostBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  const [singleBookData] = useGetSingleBookMutation<any>();
  const [editBook] = usePatchBookMutation();

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

    setTimeout(() => {
      deleteBook(headersForDelete).then(() => HereRefetch());
    }, 100);
  };

  const handleEditBook = () => {
    const { id } = selectedBook.book;
    const statusAsInt = parseInt(selectedStatus, 10);
    const body = { status: statusAsInt };

    const headersForEdit: any =
      key && secret
        ? generateAuthHeaders(
            RequestMethods.PATCH,
            `/books/${id}`,
            body,
            key,
            secret
          )
        : {};

    headersForEdit.id = id;
    headersForEdit.body = body;

    setTimeout(() => {
      editBook(headersForEdit).then(() => {
        setIsEditModalOpen(false);
        HereRefetch();
      });
    }, 1000);
  };

  const handleSearch = () => {
    // hash for GET All Books
    const headersForSearch: any =
      key && secret
        ? generateAuthHeaders(
            RequestMethods.GET,
            `/books/${searchTerm}`,
            null,
            key,
            secret
          )
        : {};

    headersForSearch.title = searchTerm;

    setTimeout(() => {
      singleBookData(headersForSearch).then((response: any) => {
        if (response.data) {
          setSearchedData(response.data);
          setIsSearchModalOpen(true);
        } else {
          setSearchedData(null);
          setIsSearchModalOpen(true);
        }
      });
    }, 100);
  };

  const handleViewBook = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleEditModalOpen = (book: any) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    HereRefetch();
  }, [isbn]);

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "New";
      case 1:
        return "Reading";
      case 2:
        return "Finished";
      default:
        return "Unknown";
    }
  };


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
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data.map((book: any) => (
                    <TableRow key={book.book.id}>
                      <TableCell>{book.book.title}</TableCell>
                      <TableCell>{book.book.author}</TableCell>
                      <TableCell>{book.book.published}</TableCell>
                      <TableCell>{book.book.pages}</TableCell>
                      <TableCell>{getStatusText(book.status)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleViewBook(book)}>
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditModalOpen(book)}
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

      <Modal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: "50%",
            overflow: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Search Results
          </Typography>
          {searchedData?.data.map((book: any, index: number) => (
            <Paper
              key={index}
              sx={{
                padding: 2,
                marginBottom: 2,
                backgroundColor: "#f0f0f0",
              }}
            >
              <Typography variant="body1">Title: {book?.title}</Typography>
              <Typography variant="body2">Author: {book?.author}</Typography>
              <Typography variant="body2">
                Published: {book?.published}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
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
            Edit Book
          </Typography>
          <Typography variant="body1">Status:</Typography>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value={"0"}>New</MenuItem>
            <MenuItem value={"1"}>Reading</MenuItem>
            <MenuItem value={"2"}>Finished</MenuItem>
          </Select>
          <Button variant="contained" style={{marginTop: '10px'}} onClick={handleEditBook}>
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
}
