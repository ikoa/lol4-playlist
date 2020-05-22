import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { API, graphqlOperation } from "aws-amplify";
import { listItems } from "./graphql/queries";
import { createItem } from "./graphql/mutations";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ProTip from './components/ProTip';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputForm } from "./components/InputForm";
import { Item, FormValue, CreateSubscriptionEvent, DeleteSubscriptionEvent } from "./types";
import { ListItemsQuery, CreateItemMutationVariables } from "./API";
import { onCreateItem, onDeleteItem } from "./graphql/subscriptions";
import { Playlist } from "./components/Playlist";
import axios from 'axios';

const apiKey: string = process.env.REACT_APP_YT_API_KEY || '';

console.log('process.env', process.env);
console.log('process.env.yotube', process.env.REACT_APP_YT_API_KEY);
console.log('process.env.node', process.env.NODE_ENV);




const isYouTubeUrl = (value: string): boolean => {
  if (!value) return false;
  const reg = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/
  const result: string[] | null = value.match(reg);
  return result ? true : false;
};

const getId = (url: string):string => {
  const result: string = url.split('watch?v=')[1];
  console.log(result ? result : 'fail: get id');
  return result;
};

const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const result = await API.graphql(graphqlOperation(listItems, { limit: 100 }));
      if ("data" in result && result.data) {
        const resultItems = result.data as ListItemsQuery;
        if (resultItems.listItems) {
          setItems(resultItems.listItems.items as Item[]);
        }
      }
    })();

    const createItemListener = API.graphql(graphqlOperation(onCreateItem));
      if ("subscribe" in createItemListener) {
        createItemListener.subscribe({
          next: ({ value: { data } }: CreateSubscriptionEvent) => {
            if (data.onCreateItem) {
              const newItem: Item = data.onCreateItem;
              setItems(prev => [...prev, newItem]);
            }
          }
        });
      }

      const deleteItemListener = API.graphql(graphqlOperation(onDeleteItem));
      if ("subscribe" in deleteItemListener) {
        deleteItemListener.subscribe({
          next: ({ value: { data } }: DeleteSubscriptionEvent) => {
            if (data.onDeleteItem) {
              const target: Item = data.onDeleteItem;
              setItems(prev => prev.filter(e => e.id !== target.id));
            }
          }
        });
      }
  }, []);

  return items;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      '& .MuiTextField-root': {
        //margin: theme.spacing(1),
        width: 492,
      },
    },
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    inline: {
      display: 'inline',
    },
  }),
);


const App: React.FC = () => {

  const items = useItems();
  const classes = useStyles();

  const handleSubmit = (props: FormValue) => {
    const id = getId(props.value);
      axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=snippet`)
      .then(res => {
        if (res.data.items[0].snippet.title) {
          // res.data.items[0].snippet.title;
          const newItem: CreateItemMutationVariables = {
            input: {
              title: res.data.items[0].snippet.title,
              url: props.value,
              img: res.data.items[0].snippet.thumbnails.default.url,
            }
          };
          API.graphql(graphqlOperation(createItem, newItem));
        }
      }).catch(err => console.log(err));
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{value: ''}}
      validationSchema={
        yup.object().shape({
          value: yup.string()
          .required('required')
          .test('is youtube url?', 'は？', isYouTubeUrl),
        })}
      validateOnChange
      validateOnBlur
      >{
        formikBag => {
          return (<>
          <Container maxWidth="sm">
            <Box my={4}>
              <Typography variant="h2" component="h2" gutterBottom>
                lol4-discord
                <br />
                default
                <br />
                playlist
              </Typography>
              <ProTip />
              <div className={classes.input}>
                <Form>
                  <InputForm
                    formikBag={formikBag}
                  />
                </Form>
              </div>
            </Box>
          <Playlist items={items} />
          </Container>
          </>);
        }
      }</Formik>
  );
};

export default App;