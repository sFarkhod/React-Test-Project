import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import generateAuthHeaders from "../assets/hashCreator";
import { RequestMethods } from "../interfaces/IRequestMethods";
import { useGetInfoMyselfQuery } from "../store/services/infoMyselfApi";
import { ClipLoader } from "react-spinners";
import { Box, Card, CardContent, Typography } from "@mui/material";

export type MySelfInfoData = {
  id: number;
  name: string;
  email: string;
  key: string;
  secret: string;
};

export type MySelfData = {
  data: MySelfInfoData;
  isOk: boolean;
  error: any;
  isLoading: boolean;
  isSuccess: boolean;
};

export default function MySelf() {
  const key = useSelector((state: any) => state.user.key);
  const secret = useSelector((state: any) => state.user.secret);

  const headers: any =
    key && secret
      ? generateAuthHeaders(RequestMethods.GET, "/myself", null, key, secret)
      : {};

  const { data, isLoading, isSuccess, refetch } =
    useGetInfoMyselfQuery<any>(headers);

  // for hiding/showing key and secret
  const [showKey, setShowKey] = useState<boolean>(false);
  const [showSecret, setShowSecret] = useState<boolean>(false);

  const toggleKeyVisibility = () => setShowKey(!showKey);
  const toggleSecretVisibility = () => setShowSecret(!showSecret);

  useEffect(() => {
    refetch()
  }, []);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <Card sx={{ minWidth: 275, maxWidth: 600 }}>
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <ClipLoader color="#fff" />
              </Box>
            ) : (
              isSuccess && (
                <>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ textAlign: "center", marginBottom: 2 }}
                  >
                    My Profile
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <b>ID:</b> {data?.data?.id}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <b>Email:</b> {data?.data?.email}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <b>Name:</b> {data?.data?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <b>
                      Key:
                      {showKey ? (
                        data?.data?.key
                      ) : (
                        <>
                          {data?.data?.key.replace(/./g, "*")}
                          <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={toggleKeyVisibility}
                          >
                            {" "}
                            (Show)
                          </span>
                        </>
                      )}
                    </b>
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <b>
                      Secret:
                      {showSecret ? (
                        data?.data?.secret
                      ) : (
                        <>
                          {data?.data?.secret.replace(/./g, "*")}
                          <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={toggleSecretVisibility}
                          >
                            {" "}
                            (Show)
                          </span>
                        </>
                      )}
                    </b>
                  </Typography>
                </>
              )
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
