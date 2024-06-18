const { AskAiChat, formatReviews } = require("../function/AIchat");
const { GetTheChild, AddRekomendasiToDB, GetRekomendasiAItoDB } = require("../model/AskAI");
const { SearchUserForAccessIdDB } = require("../model/DataKeuanganModel");
const { GetPostFromAccessId } = require("../model/Post");

const ChatAiRoute = async (req, res) => {
  try {
    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { access_id } = user[0];

    const { pesan } = req.body;

    const BalasanAi = await AskAiChat(pesan, "chat");
    res.status(200).send({ msg: "Query Successful", data: BalasanAi });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

const AskAIRoute = async (req, res) => {
  try {
    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { access_id } = user[0];
    const getChildFromAccessId = await GetTheChild(access_id);

    if (!getChildFromAccessId) {
      return res.status(500).send({ msg: "Failed to fetch data child" });
    }

    const idArray = getChildFromAccessId.map((item) => item.id);
    const GetPostEachidArray = await GetPostFromAccessId(idArray);

    // Wait for all the promises to resolve
    const ToAI = await Promise.all(
      GetPostEachidArray.map(async (post, index) => {
        await new Promise((resolve) => setTimeout(resolve, index * 3000)); // 2 seconds delay
        const AskAI = await AskAiChat(
          `City Name: ${post.nama_daerah} \n Review for ${post.nama_daerah}: ${formatReviews(
            post.reviews
          )} \n Give Your Analyze about this city from the review that u have get, i please do honestly explain in bahasa indonesia and output with your output formatted`,
          "generate"
        );

        const dataDB = {
          id: post.id,
          nama_daerah: post.nama_daerah,
          rekomendasi_ai: AskAI,
        };

        const AddDataToDB = await AddRekomendasiToDB(dataDB);

        return {
          id: post.id,
          nama_daerah: post.nama_daerah,
          rekomendasi_ai: AskAI,
        };
      })
    );

    res.status(200).send({ msg: "Query Successful", data: ToAI });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

const getAllRekomendasi = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { access_id } = user[0];

    // Fetch the total data count for pagination

    const getChildFromAccessId = await GetTheChild(access_id);

    if (!getChildFromAccessId) {
      return res.status(500).send({ msg: "Failed to fetch data child" });
    }

    const theChild = getChildFromAccessId.map((item) => {
      return item.id;
    });
    // const totalDataCountResult = await GetTotalDataCount(access_id);
    const totalDataCount = theChild.length - 1;

    const GetDataRekomendasiToDB = await GetRekomendasiAItoDB(theChild, limit, offset);

    if (GetDataRekomendasiToDB) {
      res.status(200).send({
        msg: "Query Successfully",
        data: GetDataRekomendasiToDB,
        currentPage: page,
        totalPages: Math.ceil(totalDataCount / limit),
      });
    } else {
      res.status(500).send({ msg: "error to fetch database" });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = { AskAIRoute, getAllRekomendasi, ChatAiRoute };
