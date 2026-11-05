import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BLOG_BASENAME } from "../lib/config";
import BlogList from "./BlogList";
import BlogPost from "./BlogPost";

export default function BlogApp() {
  return (
    <BrowserRouter basename={BLOG_BASENAME}>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/:slug" element={<BlogPost />} />
        <Route path="*" element={<BlogList />} />
      </Routes>
    </BrowserRouter>
  );
}
