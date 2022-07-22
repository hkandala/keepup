import { Button, Divider, Spacer, Tag } from "@geist-ui/core";
import { Emoji, Github } from "@geist-ui/icons";

export default function Footer(props) {
  return (
    <div className="footer-wrapper">
      <Divider my={3} />

      <div className="footer">
        <a href="https://hkandala.dev/" target="_blank" rel="noreferrer">
          <Button scale={0.5} px={0.6} icon={<Emoji />} auto />
        </a>

        <div className="attribute">
          Made for{" "}
          <Tag scale={0.8} invert>
            <a href="https://planetscale.com/" target="_blank" rel="noreferrer">
              planetscale
            </a>
          </Tag>{" "}
          x{" "}
          <Tag scale={0.8} invert>
            <a href="https://hashnode.com/" target="_blank" rel="noreferrer">
              hashnode
            </a>
          </Tag>{" "}
          hackathon
        </div>

        <a
          href="https://github.com/hkandala/keep-up"
          target="_blank"
          rel="noreferrer"
        >
          <Button scale={0.5} px={0.6} icon={<Github />} auto />
        </a>
      </div>

      <Spacer my={0.4} />
    </div>
  );
}
