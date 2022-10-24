/** @format */

import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import PostItem from "./PostItem";

const PostRelated = ({ categoryId = "", slug = "" }) => {
  console.log("PostRelated ~ slug", slug);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const docRef = query(colRef, where("category.id", "==", categoryId));
    onSnapshot(docRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        if (slug !== doc.data().slug) {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setPosts(results);
    });
  }, [categoryId, slug]);
  if (!categoryId || posts.length <= 0) return null;
  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary">
        {posts.length > 0 &&
          posts.map((item) => <PostItem key={item.id} data={item}></PostItem>)}
      </div>
    </div>
  );
};

export default PostRelated;
