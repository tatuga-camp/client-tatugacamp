import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';
import { sanityClient } from '../../sanity';

export async function fetchThanksSchool() {
  try {
    const thanksSchools = await sanityClient.fetch(`*[_type == "thanksSchools"]{
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        title,
      }`);

    return thanksSchools;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
