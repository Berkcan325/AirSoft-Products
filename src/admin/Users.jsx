import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import axios from "axios";

const Users = () => {
  const auth = getAuth();
  const { data: usersData, loading } = useGetData("users");
  const [adminRole, setAdminRole] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setAdminRole(userDoc.data().role === "admin");
        }
      } else {
        setAdminRole(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleDeleteUser = async (uid) => {
    if (!adminRole) {
      toast.error("Only admins can delete users.");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        "http://localhost:3001/deleteUser",
        { uid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User record deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user record: " + error.message);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h4 className="fw-bold">Users</h4>
          </Col>
          <Col lg="12" className="pt-5">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h5 className="pt-5 fw-bold">Loading...</h5>
                ) : (
                  usersData?.map((user) => (
                    <tr key={user.uid}>
                      <td>
                        <img
                          src={user.photoURL || ""}
                          alt={user.displayName}
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(user.uid)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Users;
