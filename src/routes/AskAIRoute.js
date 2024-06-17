const { AskAiChat } = require("../function/AICHAT");
const { GetTheChild, AddRekomendasiToDB } = require("../model/AskAI");
const { SearchUserForAccessIdDB } = require("../model/DataKeuanganModel");
const { GetPostFromAccessId } = require("../model/Post");

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

        const idArray = getChildFromAccessId.map(item => item.id);
        const GetPostEachidArray = await GetPostFromAccessId(idArray);

        // Wait for all the promises to resolve
        const ToAI = await Promise.all(
            GetPostEachidArray.map(async (post, index) => {
                await new Promise(resolve => setTimeout(resolve, index * 1000)); // 2 seconds delay
                const AskAI = await AskAiChat(`City Name: ${post.nama_daerah} \n Review for ${post.nama_daerah}: ${formatReviews(post.reviews)} \n Give Your Analyze about this city from the review that u have get, i please do honestly explain in bahasa indonesia and output with your output formatted`);
                
                const dataDB = {
                    id: post.id,
                    nama_daerah: post.nama_daerah,
                    rekomendasi_ai: AskAI
                }

                const AddDataToDB = await AddRekomendasiToDB(dataDB)
                
                return {
                    id: post.id,
                    nama_daerah: post.nama_daerah,
                    rekomendasi_ai: AskAI
                };
            })
        );
        

        res.status(200).send({ msg: "Query Successful", data: ToAI });
    } catch (error) {
        res.status(500).json({ message: `Failed to Add Alur Keuangan: ${error.message}` });
    }
};

function formatReviews(reviews) {
    // Join the reviews into a single string
    let reviewsString = reviews.join(', ');

    // Replace ', ' after each period (.) with a newline character
    reviewsString = reviewsString.replace(/\. /g, '.\n');

    return reviewsString;
}

module.exports = { AskAIRoute };
