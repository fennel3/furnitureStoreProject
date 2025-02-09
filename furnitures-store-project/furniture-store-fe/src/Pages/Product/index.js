import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {productURL} from "../../config"
import UnitContext from "../../Atoms/UnitContext";
import handleError from "../../utils/ErrorHandler";

export default function Product(props) {
    const params = useParams()

    const context = useContext(UnitContext)

    const [product, setProduct] = useState([])
    const [relatedProduct, setRelatedProduct] = useState(false)
    const [productError, setProductError] = useState('')
    const [relatedError, setRelatedError] = useState('')

    const getProduct = async (id) => {
        try {
            const response = await fetch(productURL + '?id=' + id + '&unit=' + context.unit)
            if (await handleError(response, setProductError)) {
                const data = await response.json()
                setProduct(data.data)
                if (!isNaN(data.data.related)) {
                    getRelatedProduct(data.data.related)
                }
            }
        } catch (e) {
            setProductError('Unable to retrieve product data')
        }
    }

    const getRelatedProduct = async (id) => {
        try {
            const response = await fetch(productURL + '?id=' + id + '&unit=' + context.unit)
            if (await handleError(response, setRelatedError)) {
                const data = await response.json()
                setRelatedProduct(data.data)
            }
        } catch (e) {
            setRelatedError('Unable to retrieve related product data')
        }
    }

    useEffect(() => {
        getProduct(params.productId)
    }, [params.productId])

    useEffect(() => {
        getProduct(params.productId)
    }, [context])

    return (
        <>
            <div className="jumbotron mt-4">
                <h1 className="display-4">{props.category}</h1>
                <p className="lead">If this is not the right product for you, use the back button below to see our wide selection of other products.</p>
            </div>
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={"/products/" + params.catId}> Back </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="border rounded p-4 mb-4">
                        {
                            productError &&
                            <div className="alert alert-danger">Error: {productError}</div>
                        }
                        {
                            !productError &&
                            <>
                                <span className="badge badge-info float-right">Stock: {product.stock}</span>
                                <h1>{product.color} {props.category} - &pound;{product.price}</h1>
                                <h3>Dimensions</h3>
                                <p>Width: {product.width}{context.unit}</p>
                                <p>Height: {product.height}{context.unit}</p>
                                <p>Depth: {product.depth}{context.unit}</p>
                            </>
                        }
                    </div>

                    {relatedProduct &&
                        <div className="border rounded p-4 mb-4">
                            <h4 className="border-bottom pb-2">Similar product</h4>
                            <span className="badge badge-info float-right">Stock: {relatedProduct.stock}</span>
                            <h5>&pound;{relatedProduct.price}</h5>
                            <Link className="btn btn-primary float-right" to={"/products/" + relatedProduct.categoryId + '/' + product.related}>More >></Link>
                            <p>Color: {relatedProduct.color}</p>
                        </div>
                    }
                    {
                        relatedError &&
                        <div className="alert alert-danger">Error: {relatedError}</div>
                    }
                </div>
            </div>
        </>
    );
}