import { Text, Card, Avatar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getStandardPlural, parseStringSet } from '../utilities';
import { Rating } from 'react-native-ratings';
import { PURPLE_COLOR } from "../constants";
import star from "../../assets/star.png"

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    paddingBottom: 0,
  },
  eventNameText: {
    fontWeight: "bold",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row"
  },
  coloredText: {
    color: '#57319e',
  },
  contentText: {
    paddingTop: 12,
    fontSize: 14
  }
});

const ACTION_TEXT_VARIANT = "labelSmall"
const bullet = (<Text style={{fontWeight: 'bold', fontSize: 14}}>· </Text>);


export const TutorProfileCard = ({tutorProfile, navigation}) => {
    const numDisciples = tutorProfile?.disciples?.length ?? 0;

    const numRatingsPerCategory = [0];
    for (let i = 1; i <= 5; i++) 
    {
        numRatingsPerCategory.push(parseStringSet(tutorProfile?.rating[i.toString()]).length);
    };

    const totalNumRatings = numRatingsPerCategory.reduce((a, b) => a + b, 0) ?? 1;

    const calculatedRating = (1 * numRatingsPerCategory[1] + 2 * numRatingsPerCategory[2] + 3 * numRatingsPerCategory[3]
        + 4 * numRatingsPerCategory[4] + 5 * numRatingsPerCategory[5]) / (totalNumRatings > 0 ? totalNumRatings : 1);


    return (
        <Card style={styles.card} onPress={() => {
            navigation.navigate('TutorProfile', {tutorUid: tutorProfile?.uid, tutorRating: calculatedRating, totalNumRatings: totalNumRatings, numDisciples: numDisciples});
        }
        }>
            <Card.Title title={tutorProfile?.fullName} subtitle={null} titleStyle={{fontSize: 22, fontWeight: "bold"}} right={() =>
            <View style={{display: "flex", flexDirection: "row", paddingBottom: 12}}>
                {totalNumRatings > 0 ? 
                (<>
                    <Text style={{color: "#9662fc", fontSize: 18}}>{calculatedRating.toFixed(1)} </Text>
                    <Rating
                        type="custom"
                        ratingImage={star}
                        ratingColor={PURPLE_COLOR}
                        imageSize={18}
                        startingValue={Math.round(calculatedRating * 2) / 2}
                        ratingBackgroundColor="#BDC3C7"
                        readonly={true}
                        fractions={2}
                        style={{paddingTop: 3}}/>
                    <Text style={{fontSize: 18}}> ({totalNumRatings}) </Text>
                </>)
                : (<Text style={{fontSize: 18, color: '#999999'}}> No ratings yet </Text>)}

            </View>}/>

            <Card.Content style={styles.cardContent}>
                <View style={{paddingRight: 20}}>
                    <Avatar.Image style={styles.picture} size={100} source={tutorProfile?.pfpUrl && { uri: tutorProfile.pfpUrl }} />
                </View>
                <View style={{flexDirection: "column"}}>
                    <Text style={styles.contentText}>
                        {bullet}
                        <Text style={styles.coloredText}>Currently working with {numDisciples} student{getStandardPlural(numDisciples)}</Text>
                    </Text>
                    <Text style={styles.contentText}>
                        {bullet}
                        <Text style={styles.coloredText}>{numDisciples} class{numDisciples === 1 ? "" : "es"} taken</Text>
                    </Text>
                    <Text style={styles.contentText}>
                        {bullet}
                        <Text style={styles.coloredText}>${tutorProfile?.hrRate}/hour</Text>
                    </Text>
                </View>

            </Card.Content>
        </Card>
)};