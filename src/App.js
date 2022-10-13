import { NavBar, UpdateOrder, AddOrder } from "./ui-components";
import { DataStore } from "@aws-amplify/datastore";
import { Divider, withAuthenticator } from '@aws-amplify/ui-react';
import { useState } from "react";
import { Order } from "./models";
import './App.css';


function App({ signOut }) {

  const [order_number, setorder_number] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [vendor, setvendor] = useState("");
  const [status, setstatus] = useState("");

  const saveOrder = async () => {
    try {
      await DataStore.save(
        new Order({
          order_number: order_number,
          phone_number: phone_number,
          vendor: vendor,
          status: status,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const updateOrder = async () => {
    try {
        /* console.log("id:",id,"Order:",Order,"DataStore:",DataStore);*/
        const original = await DataStore.query(Order,order_number);
        console.log("original:", original);
      await DataStore.save(
        Order.copyOf(original, updated => {
          updated.status = status;
        })
      );
      console.log("Order updated:", original);
    } catch (error) {
      console.error("save failed:", error);
    }
  }

  const addOrderOverrides = {
    "TextField29766922": {
      onChange: (event) => {
        setorder_number(event.target.value);
      }
    },
    "TextField29766923": {
      onChange: (event) => {
        setphone_number(event.target.value);
      }
    },
    "TextField29766924": {
      onChange: (event) => {
        setvendor(event.target.value);
      }
    },
    "TextField34502691": {
      onChange: (event) => {
        setstatus(event.target.value);
      }
    },
    "Button": {
      onClick: saveOrder,
    }
  }

  const updateOrderOverrides = {
    "TextField34542939": {
      onChange: (event) => {
        setorder_number(event.target.value)
      }
    },
    "TextField34542942": {
      onChange: (event) => {
        setstatus(event.target.value)
      }
    },
    "Button": {
      onClick: updateOrder,
    }
  }

  const navbarOverrides = {
    "Button": {
      onClick: signOut,
    },
  };
  return (
    <div className="App">
      <NavBar overrides={navbarOverrides} width="100%" />
      <header className="App-header">
        <h1>CloudQ Ordering</h1>
        <AddOrder overrides={addOrderOverrides} style={{ textAlign: "left", margin: "1rem" }} />
        <Divider />
        <UpdateOrder overrides={updateOrderOverrides} style={{ textAlign: "left", margin: "1rem" }} />
      </header>
    </div>
  );
}

export default withAuthenticator(App);
