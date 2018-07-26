import pem
import jwt

def decode_message(encoded_message):
    public_key = open("/Users/zak/clatoolkit_stuff/new/clatoolkit_importer/credentials/clatoolkit_service_public.pem",
                      "r") # pem.parse_file("/Users/zak/clatoolkit_services/clatoolkit_importer/credentials/clatoolkit_service_public.pem")
    public_key = public_key.read()
    #print("PUBLIC_KEY: %s" % public_key)

    decoded = jwt.decode(encoded_message, public_key, algorithms='RS256')
    #print("DECODED: %s" % decoded)

    return decoded