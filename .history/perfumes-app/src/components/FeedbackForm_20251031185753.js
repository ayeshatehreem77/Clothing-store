import React, { useState } from "react";

function FeedbackForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Please write a comment");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // token from login
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (res.ok) {
        alert("Review added!");
        setComment("");
        onReviewAdded(); // refresh reviews
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h6 className="fw-bold mb-2">Leave a Review:</h6>

      <div className="mb-2">
        <label className="form-label me-2">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="form-select w-auto d-inline-block"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="form-control mb-3"
        rows="3"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button className="btn btn-dark" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default FeedbackForm;
