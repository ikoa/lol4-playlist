import React from "react";
import { IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Link, ListItemSecondaryAction, Divider } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { API, graphqlOperation } from "aws-amplify";
import { Item } from "../types";
import { deleteItem } from "../graphql/mutations";

export const Playlist: React.FC<{items: Item[]}> = ({
  items
}) => {
  return (
    <List>
      {items.map((e, i)=>
        <React.Fragment key={i}>
          <MusicItem
            item={e}
          />
        </React.Fragment>
      )}
    </List>
  );
};

const MusicItem: React.FC<{item: Item}> = ({
  item,
}) => {
  const handleDelete = async (id: string | null | undefined) => {
    console.log(item);
    if (!id) {
      alert('??');
      return;
    }
    try {
      const input = {id};
      await API.graphql(graphqlOperation(deleteItem, { input }));
    } catch(err) {
      alert(err);
    }
  }
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt="?" src={item.img} />
        </ListItemAvatar>
        <ListItemText
          primary={<Link href={item.url} target="_blank">{item.title}</Link>}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
            <DeleteIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
