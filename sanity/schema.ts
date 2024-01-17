import { type SchemaTypeDefinition } from "sanity";
import aboutUsInformation from "./schemas/aboutUsInformation";
import announcement from "./schemas/announcement";
import author from "./schemas/author";
import blockContent from "./schemas/blockContent";
import category from "./schemas/category";
import categoryTaboo from "./schemas/categoryTaboo";
import commonQuestions from "./schemas/commonQuestions";
import homepagePosts from "./schemas/homepagePosts";
import members from "./schemas/members";
import post from "./schemas/post";
import serviceCard from "./schemas/serviceCard";
import taboo from "./schemas/taboo";
import tatugaSchoolPosts from "./schemas/tatugaSchoolPosts";
import thanksSchools from "./schemas/thanksSchools";
import whatsNews from "./schemas/whatsNews";
import whatWeGotCards from "./schemas/whatWeGotCards";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    aboutUsInformation,
    announcement,
    author,
    blockContent,
    category,
    categoryTaboo,
    commonQuestions,
    homepagePosts,
    members,
    post,
    serviceCard,
    taboo,
    tatugaSchoolPosts,
    thanksSchools,
    whatsNews,
    whatWeGotCards,
  ],
};
