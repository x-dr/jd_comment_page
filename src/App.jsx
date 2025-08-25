import { useState, useEffect } from "react";
import { Button, Input, Card, Typography, Spin, message, Row, Col, Image } from "antd";
import { ClearOutlined, SearchOutlined, CopyOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function App() {
  const [data, setData] = useState({ imageUrls: [] });
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [IP, setIP] = useState("");

  // 获取用户IP地址
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch('/api/ip');
        if (!res.ok) throw new Error(`请求失败，状态码 ${res.status}`);
        const data = await res.json();

        // const geo = data.geo.geo || {};
        setIP(data.geo.clientIp); // 设置 IP 地址信息
      } catch (error) {
        console.error('获取IP失败:', error);
        setIP('未知IP');
      }
    };
    fetchIP();
  }, []);

  const getData = async () => {
    fetchImages("1");
    if (title) {
      fetchComment(title);
    } else {
      if (productId) {
        setComment("用ID获取商品标题失败，请输入商品标题以获取评价！");
        message.error("用ID获取商品标题失败，请输入商品标题以获取评价！");
      } else {
        setComment("请输入商品标题以获取评价");
        message.error("请输入商品标题以获取评价");
      }
    }
  };

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

  const handleCopyComment = () => {
    if (comment) {
      navigator.clipboard
        .writeText(comment)
        .then(() => {
          message.success("复制成功！");
        })
        .catch((error) => {
          message.error("复制失败!");
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

  const clearInputs = () => {
    setTitle("");
    setProductId("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-20">
      <Card className="shadow-lg">
        <Title level={2} className="text-center text-blue-600 mb-6">
          京东商品图片评论
        </Title>

        {/* 输入框和按钮 */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={8}>
            <Input
              placeholder="商品标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} md={8}>
            <Input
              placeholder="请输入商品ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} md={8}>
            <Row gutter={8}>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => getData(page)}
                  loading={loading}
                  size="large"
                  className="w-full"
                >
                  {loading ? "获取中..." : "获取"}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  danger
                  icon={<ClearOutlined />}
                  onClick={clearInputs}
                  size="large"
                  className="w-full"
                >
                  清除
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* AI 评价区域 */}
        <Card
          title="AI 评价"
          className="mb-6"
          extra={
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopyComment}
              disabled={!comment || commentLoading}
            >
              复制
            </Button>
          }
        >
          <div className="min-h-[60px] cursor-pointer" onClick={handleCopyComment}>
            {commentLoading ? (
              <div className="flex items-center justify-center">
                <Spin size="small" className="mr-2" />
                <Text>获取中...</Text>
              </div>
            ) : (
              <Text className="text-gray-700 leading-relaxed">
                {comment || "请输入商品信息获取评价"}
              </Text>
            )}
          </div>
        </Card>

        {/* 图片展示区域 */}
        {loading && (
          <div className="text-center mt-2 py-8">
            <Spin size="large" />
            <div className="mt-2">
              <Text>加载中...</Text>
            </div>
          </div>
        )}

        {data.imageUrls.length > 0 && (
          <>
            <Row gutter={[16, 16]} className="mb-6">
              {data.imageUrls.map((url, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    hoverable
                    className="overflow-hidden"
                    styles={{ padding: 0 }}
                  >
                    <img
                      src={url}
                      alt={`评论图片 ${index + 1}`}
                      className="w-full h-48 object-cover cursor-pointer"
                      onContextMenu={(e) => e.stopPropagation()}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* 分页控制 */}
            <Row justify="space-between" align="middle" className="mt-6">
              <Col>
                <Button
                  icon={<LeftOutlined />}
                  onClick={loadPreviousPage}
                  disabled={loading || page === 1}
                  size="large"
                >
                  上一页
                </Button>
              </Col>
              <Col>
                <Text strong className="text-lg">
                  第 {page} 页
                </Text>
              </Col>
              <Col>
                <Button
                  icon={<RightOutlined />}
                  onClick={loadNextPage}
                  disabled={loading}
                  size="large"
                >
                  下一页
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card>

      {/* 页脚 */}
      <footer className="text-center text-gray-500 py-3 fixed inset-x-0 bottom-0 h-[70px] w-full z-50 flex flex-col justify-center items-center bg-white shadow-inner">
        <p className="text-xs leading-tight mb-1">Copyright © {new Date().getFullYear()} Powered by 小东</p>
        <p className="text-xs leading-tight">{IP}</p>
      </footer>
    </div>
  );
}

export default App;
