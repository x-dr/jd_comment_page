"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const [data, setData] = useState({ imageUrls: [] });
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(""); // 默认商品 ID
  const [title, setTitle] = useState(""); // 商品标题
  const [page, setPage] = useState(1); // 当前页
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false); // 复制成功状态

  const getData = async () => {
    fetchImages("1"); // 默认获取第一页图片
    if (title) {
      fetchComment(title);
    } else {
      if (productId) {
        // 如果没有提供标题，使用 productId 获取标题
        const titleResult = await get_title(productId);
        if (titleResult === false) {
          setComment("用ID获取商品标题失败，请输入商品标题以获取评价！"); // 设置提示信息
          toast.error("用ID获取商品标题失败，请输入商品标题以获取评价！"); // 提示用户
          // return;
        } else {
          setTitle(titleResult); // 设置标题
          fetchComment(titleResult); // 使用获取到的标题获取评价
        }


      } else {
        setComment("请输入商品标题以获取评价");
      }
    }

  };

  // 获取商品图片
  const fetchImages = async (pageNum = page) => {
    if (!productId) {
      setComment("请输入商品ID以获取图片");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, n: pageNum }),
      });

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("获取数据失败:", error);
      setComment("获取失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  const get_title = async (id) => {
    try {
      const response = await fetch(`/api/mmbuy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.status === 0 && result.data) {
        return result.data.single.title || false; // 返回标题
      } else {
        return false;;
      }
    } catch (error) {
      return false; // 返回失败
    }
  }
  // 获取 AI 评价
  const fetchComment = async (title) => {
    setCommentLoading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const result = await response.json();
      setCommentLoading(false);
      setComment(result.comment || "暂无评价");
    } catch (error) {
      setCommentLoading(false);
      console.error("获取评价失败:", error);
      setComment("评价获取失败");
    }
  };

  // 复制评论内容到剪贴板
  const handleCopyComment = () => {
    if (comment) {
      navigator.clipboard
        .writeText(comment)
        .then(() => {
          toast.success("复制成功！");
        })
        .catch((error) => {
          toast.error("复制失败!");
          console.error("复制失败:", error);
        });
    }
  };

  const loadNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
    window.scrollTo(0, 0);
  };

  const loadPreviousPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchImages(prevPage);
      window.scrollTo(0, 0);
    }
  };

  // 清除输入框
  const clearInputs = () => {
    setTitle("");
    setProductId("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
        京东商品图片评论
      </h1>

      {/* 输入框和按钮 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="商品标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="请输入商品ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 w-full ">
          <button
            onClick={() => getData(page)}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 transition duration-300 flex-1 md:flex-none"
            disabled={loading}
          >
            {loading ? "获取中..." : "获取"}
          </button>
          <button
            onClick={clearInputs}
            className=" bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition duration-300 flex-1 md:flex-none"
          >
            清除
          </button>
        </div>

      </div>
      {/* 加载状态 */}
      {loading && <p className="text-center text-gray-500">加载中...</p>}

      {/* 渲染评论 */}
      <h2 className="text-xl font-semibold text-gray-700">AI 评价</h2>
      <div className="mt-4 text-lg text-gray-700 cursor-pointer" onClick={handleCopyComment}>
        {commentLoading ? "获取中..." : comment}
      </div>

      {/* 渲染图片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {data.imageUrls.map((url, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg transition transform hover:scale-105"
          >
            <img src={url} alt="评论图片" className="w-full h-auto rounded-lg" />
          </div>
        ))}
      </div>

      {/* 上一页和下一页按钮 */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={loadPreviousPage}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 transition duration-300"
          disabled={loading || page === 1}
        >
          {loading ? "加载中..." : "上一页"}
        </button>
        <div className="text-xl font-semibold text-gray-700">第 {page} 页</div>
        <button
          onClick={loadNextPage}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 transition duration-300"
          disabled={loading}
        >
          {loading ? "加载中..." : "下一页"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
