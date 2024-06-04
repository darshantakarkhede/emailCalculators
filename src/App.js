import { Badge, Container } from "react-bootstrap";
import "./App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    text: "",
    splitBy: 0,
    checkCopied: {copied:false},
  });
  const [splitEmails, setSplitEmails] = useState([]);
  const chunkify = function* (itr, size) {
    let chunk = [];
    for (const v of itr) {
      chunk.push(v);
      if (chunk.length === size) {
        yield chunk;
        chunk = [];
      }
    }
    if (chunk.length) yield chunk;
  };

  const onCalClick = () => {
    const emails = [];
    const words = form.text.split(/\s+/);

    for (let word of words) {
      if (word.includes("@") && word.includes(".")) {
        const parts = word.split("@");
        if (parts.length === 2 && parts[1].includes(".")) {
          emails.push(word);
        }
      }
    }
    let comaRemovedEmails = [];
    emails.forEach((value) => {
      comaRemovedEmails.push(value.replace(/,/g, "").replace(/;/g, ""));
    });
    console.log("email", emails);
    setCount(emails.length);
    setSplitEmails([...chunkify(comaRemovedEmails, Number(form.splitBy))]);
  };
  const setField = (value, field) => {
    setForm({
      ...form,
      [field]: value,
    });
  };
  const onClear =()=>{
    setCount(0)
    setForm({
      text: "",
      splitBy: 0,
      checkCopied: {copied:false},
    })
    setSplitEmails([])
  }

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Enter Emails For calculate Email Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={form.text}
            onChange={(e) => setField(e.target.value, "text")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicNumber">
          <Form.Label>Split Email By</Form.Label>
          <Form.Control
            type="number"
            value={form.splitBy}
            placeholder="Enter Split By"
            onChange={(e) => setField(e.target.value, "splitBy")}
          />
        </Form.Group>
        <Button variant="primary mr-3" onClick={() => onCalClick()}>
          Calculate
        </Button>{' '}
        <Button variant="danger" onClick={() => onClear()}>
          clear
        </Button>
      </Form>
      <div>Total Emails are : {count}</div>
      {(form.splitBy?.length > 0 && splitEmails?.length) &&
        splitEmails.map((val, index) => {
          return (
            <Form>
              <Form.Group className="mb-3">
                <Form.Control as="textarea" rows={4} value={val} />
                <Button
                  onClick={() => {
                    setForm({ ...form, checkCopied: { copied: true, index } });
                    navigator.clipboard.writeText(val);
                    setTimeout(() => {
                      setForm({
                        ...form,
                        checkCopied: { copied: false, index },
                      });
                    }, 1000);
                  }}
                >
                  copy to clipboard
                </Button>
                {form.checkCopied.copied &&
                  form.checkCopied.index === index && (
                    <Badge bg="secondary">Copied!</Badge>
                  )}
              </Form.Group>
            </Form>
          );
        })}
    </Container>
  );
}

export default App;
