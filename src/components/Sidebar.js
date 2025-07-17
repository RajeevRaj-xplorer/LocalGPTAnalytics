import React from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';

const dummyContacts = [
  { id: 1, name: 'Alice', pinned: true },
  { id: 2, name: 'Bob', pinned: false },
  { id: 3, name: 'Group: Project', pinned: false },
];

function Sidebar({ contacts, selectedContact, onSelectContact }) {
  return (
    <Box sx={{ width: 300, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', p: 2 }}>
      <Typography variant="h6" gutterBottom>Contacts & Groups</Typography>
      <List>
        {contacts.map((contact) => (
          <ListItem
            key={contact.id}
            selected={selectedContact && selectedContact.id === contact.id}
            button
            onClick={() => onSelectContact(contact)}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="pin">
                  <PushPinIcon color={contact.pinned ? 'primary' : 'inherit'} />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={contact.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
