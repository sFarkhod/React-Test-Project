import { useState, useEffect } from "react";
import { useForm, Resolver, Controller } from "react-hook-form";
import { useRegisterUserMutation } from "../store/services/signupApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import "../assets/css/Register.css";
import { animated, useSprings } from "react-spring";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { setKey, setSecret } from "../store/services/userSlice";

// types
export type RegisterFormValues = {
  name: string;
  email: string;
  key: string;
  secret: string;
};

// resolver for validating inputs
const resolver: Resolver<RegisterFormValues> = async (values) => {
  return {
    values,
    errors: {
      ...(values.name === ""
        ? {
            name: {
              type: "required",
              message: "Please write your name. This field cannot be empty.",
            },
          }
        : {}),
      ...(values.email === ""
        ? {
            email: {
              type: "required",
              message: "Please write your email. This field cannot be empty.",
            },
          }
        : {}),
      ...(values.key === ""
        ? {
            key: {
              type: "required",
              message: "Please write your key. This field cannot be empty.",
            },
          }
        : {}),
      ...(values.secret === ""
        ? {
            secret: {
              type: "required",
              message: "Please write your secret. This field cannot be empty.",
            },
          }
        : {}),
    },
  };
};

// For animation function for getting random shape, color, direction
const getRandomShape = () => {
  const shapes = ["circle", "square", "triangle"];
  return shapes[Math.floor(Math.random() * shapes.length)];
};
const getRandomColor = () => {
  const colors = ["#e6da5a", "#40b3a1", "#d9465d", "#6866d7"];
  return colors[Math.floor(Math.random() * colors.length)];
};
const getRandomDirection = () => {
  const directions = ["left", "right", "up", "down"];
  return directions[Math.floor(Math.random() * directions.length)];
};



export default function Register() {
  // array of spheres
  const [spheres, setSpheres] = useState<any>([]);
  
  const navigate = useNavigate();

  // for showing and hiding passwords
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const handleKeyVisibility = () => {
    setShowKey((prevShowKey) => !prevShowKey);
  };
  const handleSecretVisibility = () => {
    setShowSecret((prevShowKey) => !prevShowKey);
  };

  // default place for spheres
  useEffect(() => {
    const initialSpheres: any = Array.from({ length: 15 }, () => ({
      x: Math.random() * (window.innerWidth - 20),
      y:
        Math.random() *
          (window.innerHeight - (10 * window.innerHeight) / 100 - 200) +
        (10 * window.innerHeight) / 100,
      shape: getRandomShape(),
      color: getRandomColor(),
      direction: getRandomDirection(),
    }));
    setSpheres(initialSpheres);
  }, []);

  // animation for spheres
  const animatedSpheres = useSprings(
    spheres.length,
    spheres.map((item: any) => ({
      from: { x: item.x, y: item.y },
      to: async (next: any) => {
        while (1) {
          await next({
            x: Math.random() * (window.innerWidth - 20),
            y:
              Math.random() * (200 - window.innerHeight * 0.1) +
              window.innerHeight * 0.1,
          });
          await next({ x: item.x, y: item.y });
        }
      },
      config: { duration: 5000, tension: 0.1, friction: 500 },
    }))
  );
  
  // query
  const [RegisterResult, { isLoading }] = useRegisterUserMutation();

  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver });

  const dispatch = useDispatch()

  const onSubmit = async (data: RegisterFormValues) => {

    const RegisterData = {
      name: data.name,
      email: data.email,
      key: data.key,
      secret: data.secret
    };

    try {
      const response: any = await RegisterResult(RegisterData);
      if ("error" in response) {
        toast.error(response?.error?.data?.message);
      } else {
        dispatch(setKey(data.key));
        dispatch(setSecret(data.secret));
        toast.success("You are successfully signed up");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("There is some small issues please try again later");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
      className="custom-register-bg"
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        {animatedSpheres.map((props: any, index) => (
          <animated.div
            key={index}
            className={"animatedFigure"}
            style={{
              position: "absolute",
              width: 20,
              height: 20,
              left: props.x,
              top: props.y,
              borderRadius:
                spheres[index].shape === "circle"
                  ? "50%"
                  : spheres[index].shape === "square"
                  ? "0"
                  : spheres[index].shape === "triangle"
                  ? "0"
                  : "0",
              border: `1px solid ${spheres[index].color}`,
              borderTop:
                spheres[index].shape === "triangle"
                  ? "10px solid transparent"
                  : `1px solid ${spheres[index].color}`,
              borderLeft:
                spheres[index].shape === "triangle"
                  ? "10px solid transparent"
                  : `1px solid ${spheres[index].color}`,
              borderRight:
                spheres[index].shape === "triangle"
                  ? "10px solid transparent"
                  : `1px solid ${spheres[index].color}`,
              borderBottom:
                spheres[index].shape === "triangle"
                  ? "20px solid " + spheres[index].color
                  : `1px solid ${spheres[index].color}`,
              ...props,
            }}
          />
        ))}
        <Paper
          elevation={3}
          style={{ padding: "20px" }}
          className="registerMain"
        >
          <Typography variant="h3" align="center" className="RegisterH2">
            Register
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="key"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Key"
                  type={showKey ? "text" : "password"}
                  error={!!errors.key}
                  helperText={errors.key ? errors.key.message : ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleKeyVisibility} edge="end">
                          {showKey ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="secret"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Secret"
                  type={showSecret ? "text" : "password"}
                  error={!!errors.secret}
                  helperText={errors.secret ? errors.secret.message : ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSecretVisibility} edge="end">
                          {showSecret ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              fullWidth
              style={{ marginTop: "20px", height: "50px" }}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}
