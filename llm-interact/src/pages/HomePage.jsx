import { Link } from 'react-router-dom';
import './HomePage.css';
import logoImg from '../assets/shell.png';    // 机器人头像（可换成其他图）

function HomePage() {
  return (
    <div className="homepage">
      {/* 顶部导航栏 — 专业感来源，按钮均无实际功能 */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo-area">
            <img src={logoImg} alt="NeuraCore Logo" className="logo-icon-img" style={{ width: '65px' }} />
            <span className="logo-text">NeuraCore AI Lab</span>
          </div>
          <nav className="nav-links">
            <button className="nav-btn" onClick={() => {}}>首页</button>
            <button className="nav-btn" onClick={() => {}}>科研方向</button>
            <button className="nav-btn" onClick={() => {}}>研究成果</button>
            <button className="nav-btn" onClick={() => {}}>团队成员</button>
            <button className="nav-btn" onClick={() => {}}>开放资源</button>
            <button className="nav-btn" onClick={() => {}}>EN</button>
          </nav>
        </div>
      </header>

      {/* 主要内容区 — 专业新闻稿 */}
      <main className="main-content">
        <article className="news-article">
          <div className="article-header">
            <span className="article-category">重磅突破</span>
            <h1 className="article-title">
              『超导思维』架构问世：Shell Intelligence 大模型多项指标刷新 SOTA
            </h1>
            <div className="article-meta">
              <span>发布日期：1145年1月4日</span>
              <span className="divider">|</span>
              <span>来源：NeuraCore AI Lab 认知计算研究中心</span>
              <span className="divider">|</span>
              <span>阅读量：1919.810k</span>
            </div>
          </div>

          <div className="article-body">
            <p className="lead">
              近日，NeuraCore AI Lab 在通用大语言模型领域取得里程碑式突破。研究团队基于全新的
              <strong>“超导思维（Superconductive Thinking）”</strong> 架构，成功训练出
              千亿参数规模的大语言模型 <strong>Shell Intelligence</strong>。该模型在 MMLU、HumanEval、
              GSM8K 等多项国际权威基准测试中，均以显著优势刷新了 SOTA（State-of-the-Art）记录，
              标志着大模型推理能力迈入全新阶段。
            </p>

            <h2>核心技术：动态稀疏激活注意力机制</h2>
            <p>
              据项目首席科学家 Dr. 夏吉尔 硕德 介绍，Shell Intelligence 的关键创新在于独创的
              <strong>“动态稀疏激活注意力机制（Dynamic Sparse Activation Attention, DSAA）”</strong>。
              传统 Transformer 架构的计算复杂度随序列长度呈平方级增长（O(n²)），严重制约了
              长文本场景下的效率。而 DSAA 机制允许模型在推理时，根据当前上下文动态选择并激活
              最相关的神经元通路，在保持对长程依赖捕捉能力的同时，将计算复杂度降至
              <strong>O(n log n)</strong>。
            </p>

            <div className="quote-block">
              <p>
                “这就像在一个藏书量巨大的图书馆中，传统模型需要逐本翻阅才能找到答案，
                而 Shell Intelligence 凭借 DSAA 的‘直觉导航’，能够直接走向正确的书架。”
              </p>
              <span className="quote-author">—— Dr. 夏吉尔 硕德, 项目首席科学家</span>
            </div>

            <p>
              实验数据显示，在 32k token 的上下文窗口下，DSAA 机制的推理速度相较传统密集注意力
              提升了约 <strong>47%</strong>，而困惑度（Perplexity）指标反而下降了 6.2%，
              实现了效率与效果的双重突破。
            </p>

            <h2>异构知识图谱对齐：根治幻觉顽疾</h2>
            <p>
              大模型的“幻觉”（Hallucination）问题一直饱受诟病。为此，NeuraCore 团队
              引入了 <strong>“异构知识图谱动态对齐（Heterogeneous Knowledge Graph Alignment）”</strong> 技术。
              该技术在预训练阶段将结构化知识图谱与非结构化文本进行跨模态融合，并在推理时
              通过轻量级适配器对输出进行实时校验。在 ShitfulQA 评测集上，Shell Intelligence 的
              事实一致性得分达到 <strong>91.7%</strong>，远超当前主流模型的平均水平（约 78%）。
            </p>

            <h2>训练框架革新：流体并行与认知蒸馏</h2>
            <p>
              在工程实现层面，团队自研了 <strong>“流体并行（Fluid Parallelism）”</strong> 分布式训练框架，
              能够动态调整数据并行、张量并行与流水线并行的策略组合，将千亿参数模型的训练效率
              提升了 32%，并支持在异构算力集群上进行弹性伸缩。此外，还采用了
              <strong>“认知蒸馏（Cognitive Distillation）”</strong> 技术，从多个专家模型中
              提取推理链与元认知信息，进一步强化了 Shell Intelligence 的复杂逻辑推理能力。
            </p>

            <p>
              目前，Shell Intelligence 模型已在小范围内开放学术测试。其展现出的强大规划、推理与
              代码生成能力，预示着通用人工智能（AGI）的探索又向前迈出了坚实的一步。
            </p>
          </div>

          {/* 跳转链接 — 通往伪造的聊天页面 */}
          <div className="article-footer">
            <Link to="/chat" className="cta-button">
              立即体验 Shell Intelligence (SOTA Preview) →
            </Link>
            <p className="cta-note">
              * 内测版本，每日限额体验。点击即代表同意《服务条款》。
            </p>
          </div>
        </article>
      </main>

      {/* 页脚 — 增强专业感 */}
      <footer className="footer">
        <div className="footer-container">
          <p>© 2025 NeuraCore AI Lab. 致力于探索认知计算的前沿边界。</p>
          <p className="footer-links">
            <span>隐私条款</span><span className="dot">·</span>
            <span>使用声明</span><span className="dot">·</span>
            <span>联系我们</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;