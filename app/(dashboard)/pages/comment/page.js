'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import { Send, Pencil, Trash } from 'react-bootstrap-icons';

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const res = await fetch('/api/comments');
    const data = await res.json();
    if (data.success) setComments(data.data);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    const payload = replyTo
      ? { name, message, parentId: replyTo }
      : { name, message };

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      fetchComments();
      setName('');
      setMessage('');
      setReplyTo(null);
    }
  };

  const handleEdit = (id, currentMessage) => {
    setEditMode(true);
    setEditId(id);
    setMessage(currentMessage);
  };

  const handleUpdate = async () => {
    const res = await fetch('/api/comments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId: editId, message }),
    });

    const data = await res.json();
    if (data.success) {
      fetchComments();
      setEditMode(false);
      setEditId(null);
      setMessage('');
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setModalShow(true);
  };

  const confirmDelete = async () => {
    const res = await fetch('/api/comments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId: deleteId }),
    });

    const data = await res.json();
    if (data.success) {
      fetchComments();
      setModalShow(false);
      setDeleteId(null);
    }
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Komentar</h2>
      <Row>
        <Col md={8} className="mx-auto">
          {comments.map((comment) => (
            <Card className="mb-3" key={comment._id}>
              <Card.Body>
                <h5>{comment.name}</h5>
                <p>{comment.message}</p>
                <Button variant="link" onClick={() => handleReply(comment._id)} className="me-2">
                  Balas
                </Button>
                <Button variant="link" onClick={() => handleEdit(comment._id, comment.message)} className="me-2">
                  <Pencil />
                </Button>
                <Button variant="link" onClick={() => handleDelete(comment._id)} className="me-2">
                  <Trash />
                </Button>
                {comment.replies.map((reply) => (
                  <Card className="mt-3 ms-3" key={reply._id}>
                    <Card.Body>
                      <h6>{reply.name}</h6>
                      <p>{reply.message}</p>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          ))}

          <Card className="shadow-sm mt-4">
            <Card.Body>
              <Form onSubmit={editMode ? handleUpdate : handleSend}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama"
                    disabled={editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis komentar..."
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {editMode ? 'Perbarui' : 'Kirim'} <Send size={14} />
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus Komentar</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus komentar ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CommentPage;
