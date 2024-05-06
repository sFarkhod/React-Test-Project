export interface BookData {
  id: number;
  isbn: string;
  title: string;
  cover: string;
  author: string;
  published: number;
  pages: number;
}

export interface BookStatus {
  book: BookData;
  status: number;
}

export interface BookApiResponse {
  data: BookStatus[];
  isOk: boolean;
  message: string;
}
