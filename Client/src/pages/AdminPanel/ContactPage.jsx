import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch all contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/contacts');
        
        if (response.data.success) {
          setContacts(response.data.data);
        } else {
          setError('Failed to fetch contacts');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching contacts');
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Function to update contact status
  const updateContactStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/contacts/${id}`, { status });
      
      if (response.data.success) {
        // Update the contacts list with the updated contact
        setContacts(contacts.map(contact => 
          contact._id === id ? response.data.data : contact
        ));
        
        // Update selected contact if it's the one being edited
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(response.data.data);
        }
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
      alert('Failed to update contact status');
    }
  };

  // Function to delete a contact
  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/contacts/${id}`);
        
        if (response.data.success) {
          // Remove the deleted contact from the list
          setContacts(contacts.filter(contact => contact._id !== id));
          
          // Clear selected contact if it's the one being deleted
          if (selectedContact && selectedContact._id === id) {
            setSelectedContact(null);
          }
        }
      } catch (err) {
        console.error('Error deleting contact:', err);
        alert('Failed to delete contact');
      }
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading contacts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">All Messages ({contacts.length})</h2>
          </div>
          
          <div className="overflow-y-auto max-h-[70vh]">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div 
                  key={contact._id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedContact && selectedContact._id === contact._id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(contact.createdAt)}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        contact.status === 'inProgress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {contact.status === 'new' ? 'New' : 
                         contact.status === 'inProgress' ? 'In Progress' : 'Resolved'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No contact messages found</div>
            )}
          </div>
        </div>
        
        {/* Contact Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedContact ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium">Message Details</h2>
                <div className="flex space-x-2">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateContactStatus(selectedContact._id, e.target.value)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="new">New</option>
                    <option value="inProgress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => deleteContact(selectedContact._id)}
                    className="px-3 py-1 bg-black text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-6">
                  <div className="flex flex-wrap -mx-2">
                    <div className="px-2 w-full md:w-1/2 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <div className="border rounded p-2 bg-gray-50">{selectedContact.name}</div>
                    </div>
                    <div className="px-2 w-full md:w-1/2 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="border rounded p-2 bg-gray-50">{selectedContact.email}</div>
                    </div>
                    <div className="px-2 w-full md:w-1/2 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="border rounded p-2 bg-gray-50">{selectedContact.phone || 'N/A'}</div>
                    </div>
                    <div className="px-2 w-full md:w-1/2 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <div className="border rounded p-2 bg-gray-50">{formatDate(selectedContact.createdAt)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <div className="border rounded p-2 bg-gray-50">{selectedContact.subject}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="border rounded p-3 bg-gray-50 whitespace-pre-wrap min-h-[200px]">
                    {selectedContact.message}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-gray-500">
              <p>Select a contact message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;