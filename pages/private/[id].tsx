import {
  getSession,
  getServerSidePropsWrapper,
  Claims,
} from "@auth0/nextjs-auth0";
import type { NextPage, GetServerSideProps } from "next";
import Article from "../../components/Article";
import { client } from "../../libs/client";
import { Article as ArticleType, ArticleListDetail } from "../../types";

export const getServerSideProps: GetServerSideProps = getServerSidePropsWrapper(
  async (context) => {
    const { req, res } = context;
    const id = context?.params?.id as string;
    const session = await getSession(req, res);

    const data = await client.getListDetail<ArticleType>({
      endpoint: "articles",
      contentId: id,
    });
    console.log(data);

    if (!session) {
      return {
        props: {
          data: {
            title: data.title,
            description: data.description || "",
            thumbnail: data.thumbnail || null,
          },
        },
      };
    }

    return {
      props: {
        data,
        user: session.user,
      },
    };
  }
);

type Props = {
  data?: ArticleListDetail;
  user?: Claims;
};

const PrivateId: NextPage<Props> = ({ data, user }) => {
  console.log(data);
  if (!data) {
    return null;
  }
  if (!user) {
    return (
      <main>
        <Article data={data} />
        続きを読むにはログインが必要です
      </main>
    );
  }
  return <Article data={data} />;
};

export default PrivateId;
