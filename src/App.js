import { Badge, Col, Container, InputGroup, Row, Table } from "react-bootstrap";
import "./App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    text: "",
    splitBy: 0,
    checkCopied: { copied: false },
    range: 0,
    isSplitByNum: true,
    isDuplicateChecked: false,
  });
  const [splitEmails, setSplitEmails] = useState([]);
  const [emails, setEmails] = useState([]);
  const [showSplit, setShowSplit] = useState(false);
  const [duplicate, setDuplicate] = useState([]);

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
    setEmails([...comaRemovedEmails]);
    if (form.isDuplicateChecked) {
      let duplicateRecord = [];
      [...findOccurrences(comaRemovedEmails)].forEach((value)=>{
        if(value.count >1){
          duplicateRecord.push(value)
        }
      })
      setDuplicate([...duplicateRecord]);
      console.log([...findOccurrences(comaRemovedEmails)]);
    }
    if (form?.isSplitByNum) {
      let splitedEmails = [];
      [...chunkify(comaRemovedEmails, Number(form.splitBy))].map((value) => {
        return splitedEmails.push(value.toString().replace(/,/g, "; "));
      });
      setSplitEmails([...splitedEmails]);
    } else {
      let splitedEmails = [];
      let number = emails.length * (Number(form.range) / 100);

      [...chunkify(comaRemovedEmails, Math.ceil(number))].map((value) => {
        return splitedEmails.push(value.toString().replace(/,/g, "; "));
      });
      setSplitEmails([...splitedEmails]);
    }
    setShowSplit(true);
    setCount(emails.length);
  };
  const setField = (value, field) => {
    setForm({
      ...form,
      [field]: value,
    });
  };
  const onClear = () => {
    setCount(0);
    setForm({
      text: "",
      splitBy: 0,
      checkCopied: { copied: false },
      range: 0,
    });
    setSplitEmails([]);
    setShowSplit(false);
  };
  const findOccurrences = (arr = []) => {
    const res = [];
    arr.forEach((el) => {
      const index = res.findIndex((obj) => {
        return obj["email"] === el;
      });
      if (index === -1) {
        res.push({
          email: el,
          count: 1,
        });
      } else {
        res[index]["count"]++;
      }
    });
    console.log(res);
    return res;
  };
  const onDuplicateClick =()=>{
    let uniqueArray = emails.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
  }).toString().replace(/,/g,'; ')
  setForm({...form, text:uniqueArray})
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
        <Form.Check type={"checkbox"}>
          <Form.Check.Input
            type={"radio"}
            name={"checkeSplitby"}
            defaultChecked={true}
            onClick={(e) =>
              setForm({ ...form, isSplitByNum: e.target.checked })
            }
          />
          <Form.Check.Label>Split By Number of Emails</Form.Check.Label>
        </Form.Check>
        <InputGroup className="mb-3" controlId="formBasicNumber">
          <Form.Control
            type="number"
            value={form.splitBy}
            disabled={!form.isSplitByNum}
            placeholder="Enter Split By"
            onChange={(e) => setField(e.target.value, "splitBy")}
          />
        </InputGroup>
        <InputGroup>
          <Form.Check type={"checkbox"}>
            <Form.Check.Input
              type={"radio"}
              name={"checkeSplitby"}
              value={!form.isSplitByNum}
              onClick={(e) =>
                setForm({ ...form, isSplitByNum: !e.target.checked })
              }
            />
            <Form.Check.Label>
              Split By Percentage {form.range}%
            </Form.Check.Label>
          </Form.Check>
          <Form.Range
            value={form.range}
            disabled={form.isSplitByNum}
            onChange={(e) => setForm({ ...form, range: e.target.value })}
          />
        </InputGroup>
        <Form.Check type={"checkbox"}>
          <Form.Check.Input
            type={"checkbox"}
            defaultChecked={false}
            value={form.isDuplicateChecked}
            onClick={(e) =>
              setForm({ ...form, isDuplicateChecked: e.target.checked })
            }
          />
          <Form.Check.Label>Find Duplicates</Form.Check.Label>
        </Form.Check>
        <Button variant="primary mr-3" onClick={() => onCalClick()}>
          Calculate
        </Button>{" "}
        <Button variant="danger" onClick={() => onClear()}>
          clear
        </Button>
      </Form>
      <div>Total Emails are : {count}</div>

      {(form.isDuplicateChecked && duplicate.length )?(
        <><Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Duplicate Emails</th>
              <th>Duplicate Count</th>
            </tr>
          </thead>
          <tbody>
            {" "}
            {duplicate.map((value, index) => {
              return( <tr key ={index}>
                <td>{index + 1}</td>
                <td>{value.email}</td>
                <td>{value.count}</td>
              </tr>)
            })}
          </tbody>
        </Table>
        <Button className="m-2" variant="danger" onClick={() => onDuplicateClick()}>
          clear Duplicate
        </Button>
        </>
      ):null
      }
      {showSplit &&
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
