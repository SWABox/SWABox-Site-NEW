<template>
  <DocLayout
    kicker="DOC / 02 · 用户协议"
    title="用户协议"
    updated="生效日期 2026 年 5 月 20 日"
    email="content@swabox.cc.cd"
    :related="[{ label: '隐私政策', to: '/privacy' }]"
  >
    <p class="note">
      <strong>MIT 许可证适用：</strong> 本软件（SWABox）受 MIT 许可证保护。除本用户协议外，
      您对软件的使用还受限于
      <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT 许可证</a>
      的条款。简而言之：您可以自由使用，但需承担风险，且必须保留版权声明。
    </p>

    <h2 id="scope">1. 服务说明与协议范围</h2>
    <p>
      本协议适用于您对本网站及 SWABox 软件的使用行为。网站托管于 Cloudflare Pages，
      并启用了以下第三方服务：
    </p>
    <ul>
      <li><strong>Cloudflare Turnstile</strong>：人机验证，用于防御恶意机器人攻击。</li>
      <li>
        <strong>Cloudflare Web Analytics</strong>：匿名访问统计，不设置 Cookie，
        不追踪个人用户，仅用于了解网站使用情况。
      </li>
      <li><strong>Cloudflare Email Routing</strong>：邮件转发服务。</li>
    </ul>
    <p>
      使用本网站即表示您已知悉并同意接受上述服务的运作方式。详细数据处理说明请参阅我们的
      <router-link to="/privacy">隐私政策</router-link>。
    </p>

    <h2 id="turnstile">2. 人机验证机制</h2>
    <p>
      本网站采用 <strong>Cloudflare Turnstile 托管验证</strong>（自动切换无交互与手动验证）。
      您同意配合完成必要的验证流程，并遵守 Cloudflare 的相关服务条款，以确保网站安全运行。
    </p>

    <h2 id="rights">3. 用户权利与义务</h2>
    <p><strong>3.1 开源权利</strong></p>
    <p>
      根据 MIT 许可证，您有权运行、复制、分发、研究和改进本项目软件。源代码可在
      <a href="https://github.com/SWABox/SWABox" target="_blank" rel="noopener noreferrer">项目仓库</a>
      中获取。
    </p>
    <p><strong>3.2 使用限制</strong></p>
    <ul>
      <li>不得将本项目软件用于非法活动或任何违反中华人民共和国法律法规的用途。</li>
      <li>不得试图绕过、破坏或干扰 Cloudflare 的安全防护机制（包括 Turnstile 和 WAF）。</li>
      <li>不得利用本项目软件或本网站进行任何可能损害服务稳定性或影响其他用户的行为。</li>
    </ul>
    <p><strong>3.3 商标与品牌</strong></p>
    <p>
      MIT 许可证仅授予代码的使用和分发权，不授予您使用 SWABox 名称、Logo 或品牌标识进行商业推广
      或暗示官方背书的权利，除非获得开发者明确书面授权。
    </p>

    <h2 id="ip">4. 知识产权</h2>
    <p><strong>4.1 软件代码</strong>：受 MIT 许可证保护，版权归开发者所有。您需保留原始版权声明。</p>
    <p>
      <strong>4.2 网站内容</strong>：包括但不限于设计、文案、Logo、图片等，保留所有权利。
      未经开发者允许，不得复制、修改或用于其他项目。
    </p>

    <h2 id="disclaimer">5. 免责声明（MIT 标准条款）</h2>
    <p>
      <strong>本软件及网站服务按“原样”提供，没有任何形式的明示或暗示担保。</strong>
      在适用法律允许的最大范围内，作者或版权持有人不对任何索赔、损害或其他责任负责，
      无论这些责任是因合同、侵权还是其他原因引起的，与软件或服务的使用或无法使用有关。
    </p>
    <p>鉴于本项目为开源免费软件，开发者不对以下情况造成的直接或间接损失承担责任：</p>
    <ul>
      <li>网站访问受阻、服务中断或数据丢失。</li>
      <li>因第三方服务（如 Cloudflare）导致的任何问题。</li>
      <li>因使用或无法使用本软件而产生的任何后果。</li>
    </ul>

    <h2 id="changes">6. 协议变更</h2>
    <p>
      开发者有权根据需要随时更新本协议。重大变更将通过
      <a href="https://github.com/SWABox/SWABox-Site-NEW" target="_blank" rel="noopener noreferrer">网站仓库</a>
      的 Release Notes 或 Issue 通知。建议您定期查阅本页面。
    </p>

    <h2 id="contact">7. 联系方式</h2>
    <p>如有任何疑问或需要获得商标授权，请通过以下方式联系：</p>
    <ul>
      <li>
        GitHub Issues：
        <a href="https://github.com/SWABox/SWABox/issues" target="_blank" rel="noopener noreferrer">
          项目 Issues 页面
        </a>
      </li>
      <li>邮箱：<a href="mailto:content@swabox.cc.cd">content@swabox.cc.cd</a></li>
    </ul>
  </DocLayout>
</template>

<script setup>
import DocLayout from '../components/DocLayout.vue';
</script>
